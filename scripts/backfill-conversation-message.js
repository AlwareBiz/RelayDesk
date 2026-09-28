// copies every ticket_message document into conversation_message, renaming ticket_id to conversation_id
// runs in mongosh (`npm run db:backfill-conversation-messages`); additive and safe to re-run: it never
// changes ticket_message and never overwrites a conversation_message document; removed in #13
// prints the report last, as a JSON line of its own, {"source":N,"copied":N,"alreadyPresent":N,"missing":N},
// and exits 1 if missing is not 0 or the run fails

// ********************************************************************************
// == Constant ====================================================================
const BATCH_SIZE = 1000;

// == Util ========================================================================
/** the document with `ticket_id` renamed to `conversation_id`, in the same position, without `_id` */
const toConversationMessageFields = (legacyDocument) => {
 const fields = {};
 for (const [key, value] of Object.entries(legacyDocument)) {
  if (key === '_id') {
   continue;
  } /* else -- a field to copy */

  fields[key === 'ticket_id' ? 'conversation_id' : key] = value;
 }
 return fields;
};

/**
 * copies one batch; `$setOnInsert` leaves a document that is already there untouched
 * a failed write does not stop the run: the batch counts what it did write, and the `missing` pass reports the rest
 */
const copyBatch = (legacyDocuments) => {
 const operations = legacyDocuments.map((legacyDocument) => ({ updateOne: { filter: { _id: legacyDocument._id }, update: { $setOnInsert: toConversationMessageFields(legacyDocument) }, upsert: true } }));
 try {
  const result = db.conversation_message.bulkWrite(operations, { ordered: false });
  return { alreadyPresent: result.matchedCount, copied: result.upsertedCount };
 } catch (error) {
  if (!error.result) {
   throw error;
  } /* else -- some writes in the batch failed; the others went through */

  const failedWrites = error.writeErrors.map((writeError) => ({ _id: legacyDocuments[writeError.index]._id, errmsg: writeError.errmsg }));
  print(`failed writes: ${JSON.stringify(failedWrites)}`);
  return { alreadyPresent: error.result.matchedCount, copied: error.result.upsertedCount };
 }
};

/** the number of ticket_message ids with no document in conversation_message */
const countMissing = () => {
 let missing = 0;
 let batch = [];
 const countBatch = () => {
  const presentCount = db.conversation_message.countDocuments({ _id: { $in: batch } });
  missing += batch.length - presentCount;
  batch = [];
 };

 for (const { _id } of db.ticket_message.find({}, { _id: 1 }).sort({ _id: 1 })) {
  batch.push(_id);
  if (batch.length < BATCH_SIZE) {
   continue;
  } /* else -- the batch is full */

  countBatch();
 }
 countBatch();
 return missing;
};

// == Main ========================================================================
// one function, so mongosh has no statement result to echo; piped through stdin it still echoes a prompt
// for every input line, so the report starts with a newline to keep it on a line of its own
const backfill = () => {
 db.conversation_message.createIndex({ workspace_id: 1, conversation_id: 1, created_at: 1 });

 const report = { source: 0, copied: 0, alreadyPresent: 0, missing: 0 };
 let batch = [];
 const copy = () => {
  if (batch.length === 0) {
   return;
  } /* else -- there are documents to copy */

  const { alreadyPresent, copied } = copyBatch(batch);
  report.source += batch.length;
  report.copied += copied;
  report.alreadyPresent += alreadyPresent;
  batch = [];
 };

 for (const legacyDocument of db.ticket_message.find().sort({ _id: 1 })) {
  batch.push(legacyDocument);
  if (batch.length < BATCH_SIZE) {
   continue;
  } /* else -- the batch is full */

  copy();
 }
 copy();

 report.missing = countMissing();
 print(`\n${JSON.stringify(report)}`);
 if (report.missing !== 0) {
  quit(1);
 } /* else -- every old message has a copy */
};

// piped through stdin, mongosh reports an uncaught error and carries on with exit code 0
try {
 backfill();
} catch (error) {
 print(`backfill failed: ${error.message}`);
 quit(1);
}
