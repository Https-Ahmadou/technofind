import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/technofind';

let client: MongoClient;
let db: Db;

// Singleton pattern — évite les connexions multiples en dev (HMR)
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

export async function connectDB(): Promise<Db> {
  if (db) return db;

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(MONGODB_URI);
      await global._mongoClient.connect();
    }
    client = global._mongoClient;
  } else {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }

  db = client.db();
  return db;
}

export async function getCollection<T extends object>(name: string) {
  const database = await connectDB();
  return database.collection<T>(name);
}
