// runs once, when the MongoDB container initializes an empty data directory
const database = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'relaydesk');

database.conversation_message.createIndex({ workspace_id: 1, conversation_id: 1, created_at: 1 });
