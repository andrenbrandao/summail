/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
const opts: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  useCreateIndex: true,
  bufferCommands: false, // Disable mongoose buffering
};
mongoose.set('strictQuery', false);

const createMongoDBInstance = async (): Promise<void> => {
  console.log('Creating MongoDB new instance!');
  mongoServer = await MongoMemoryServer.create({
    instance: { dbName: 'mongodb-test' },
  });
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(process.env.MONGODB_URI, opts);
};

const connect = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI, opts);
};

const disconnect = async (): Promise<void> => {
  await mongoose.connection.close();
};

const clearDatabase = async (): Promise<void> => {
  const { collections } = mongoose.connection;

  const promises = Object.values(collections).map(async (collection) =>
    collection.deleteMany({}),
  );

  await Promise.all(promises);
};

const stopServer = async (): Promise<void> => {
  await mongoServer.stop();
};

export {
  createMongoDBInstance,
  connect,
  disconnect,
  clearDatabase,
  stopServer,
};
