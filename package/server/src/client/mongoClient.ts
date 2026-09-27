import { MongoClient } from 'mongodb';

import { env } from '../service/env';

// ********************************************************************************
// == Export ======================================================================
// the driver connects lazily on the first operation
export const mongoClient = new MongoClient(env.MONGODB_URL);
export const mongoDb = mongoClient.db(env.MONGODB_DB_NAME);
