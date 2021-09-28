import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// CONFIGURE MONGO MEMORY SERVER
const mongoServer = new MongoMemoryServer();

// Connect to db
export const connect = async () => {
  const URI = await mongoServer.getUri();

  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
}

// Disconnect from db and close connection
export const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}

// Tear down db
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for(const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}