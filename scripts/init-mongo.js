// runs once, when the MongoDB container initializes an empty data directory
const database = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'relaydesk');

database.ticket_message.createIndex({ workspace_id: 1, ticket_id: 1, created_at: 1 });
