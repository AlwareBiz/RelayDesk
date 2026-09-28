// drops ticket_message once every document in it has a copy in conversation_message; removed in #13
// runs in mongosh (`npm run db:drop-ticket-messages`) after `npm run db:backfill-conversation-messages`
// the guard runs first, in the same function as the drop: if any _id has no copy, it prints `missing: N`
// and up to 10 of those _ids, drops nothing and exits 1
// prints the report last, as a JSON line of its own: {"dropped":true,"documents":N} after a drop, or
// {"dropped":false,"reason":"absent"} with exit 0 when ticket_message is already gone, so it is safe to re-run

// ********************************************************************************
// == Constant ====================================================================
const BATCH_SIZE = 1000;
const MISSING_ID_LIMIT = 10;

// == Util ========================================================================
/** every ticket_message _id checked against conversation_message, with the first missing ones */
const findMissing = () => {
 const result = { checked: 0, missing: 0, missingIds: [] };
 let batch = [];
 const checkBatch = () => {
  const copiedIds = new Set(db.conversation_message.find({ _id: { $in: batch } }, { _id: 1 }).toArray().map(({ _id }) => _id));
  for (const _id of batch) {
   if (copiedIds.has(_id)) {
    continue;
   } /* else -- this message has no copy */

   result.missing += 1;
   if (result.missingIds.length < MISSING_ID_LIMIT) {
    result.missingIds.push(_id);
   } /* else -- enough examples to find the gap */
  }
  result.checked += batch.length;
  batch = [];
 };

 for (const { _id } of db.ticket_message.find({}, { _id: 1 }).sort({ _id: 1 })) {
  batch.push(_id);
  if (batch.length < BATCH_SIZE) {
   continue;
  } /* else -- the batch is full */

  checkBatch();
 }
 checkBatch();
 return result;
};

// == Main ========================================================================
// one function, so mongosh has no statement result to echo; piped through stdin it still echoes a prompt
// for every input line, so each line below starts with a newline to keep it on a line of its own
const drop = () => {
 if (!db.getCollectionNames().includes('ticket_message')) {
  print(`\n${JSON.stringify({ dropped: false, reason: 'absent' })}`);
  return;
 } /* else -- the collection is still there */

 const { checked, missing, missingIds } = findMissing();
 if (missing !== 0) {
  print(`\nmissing: ${missing}`);
  print(`first missing _ids: ${JSON.stringify(missingIds)}`);
  quit(1);
 } /* else -- every message has a copy, so nothing is lost */

 if (!db.ticket_message.drop()) {
  throw new Error('ticket_message was not dropped');
 } /* else -- the collection is gone */

 print(`\n${JSON.stringify({ dropped: true, documents: checked })}`);
};

// piped through stdin, mongosh reports an uncaught error and carries on with exit code 0
try {
 drop();
} catch (error) {
 print(`drop failed: ${error.message}`);
 quit(1);
}
