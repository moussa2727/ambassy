import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Configure Mongoose connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  connectTimeoutMS: 5000,
  bufferCommands: false, // Disable mongoose buffering
};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      connectTimeoutMS: 5000,
    });
    global._mongoClientPromise = client.connect();

    // Configure Mongoose for development
    mongoose.set('bufferCommands', false);
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    connectTimeoutMS: 5000,
  });
  clientPromise = client.connect();

  // Configure Mongoose for production
  mongoose.set('bufferCommands', false);
}

export async function connectDB() {
  try {
    // Set Mongoose options before connecting
    mongoose.set('bufferCommands', false);

    // Connect to Mongoose with timeout options
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    return await clientPromise;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function getUsersCollection() {
  const client = await connectDB();
  const db = client.db();
  return db.collection('users');
}

export async function getMessagesCollection() {
  const client = await connectDB();
  const db = client.db();
  return db.collection('messages');
}


// export async function getBlogCollection() {
//   const client = await connectDB();
//   const db = client.db();
//   return db.collection('blog');
// }


export default clientPromise;
