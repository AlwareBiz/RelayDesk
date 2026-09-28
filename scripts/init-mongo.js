// runs once, when the MongoDB container initializes an empty data directory
// an existing volume gets the conversation_message index from `npm run db:backfill-conversation-messages`
const database = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'relaydesk');

database.conversation_message.createIndex({ workspace_id: 1, conversation_id: 1, created_at: 1 });
database.ticket_message.createIndex({ workspace_id: 1, ticket_id: 1, created_at: 1 }); // read by the dual read until #12, which drops the collection
