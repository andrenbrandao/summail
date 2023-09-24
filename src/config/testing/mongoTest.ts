/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
const opts: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  bufferCommands: false, // Disable mongoose buffering
};
mongoose.set('strictQuery', false);

const connect = async (): Promise<void> => {
  console.log('Creating a new instance!');
  mongoServer = await MongoMemoryServer.create({
    instance: { dbName: 'mongodb-test' },
  });
  const mongoUri = mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, opts);

    process.env.MONGODB_URI = mongoUri;
  } catch (err) {
    console.error(err);
  }
};

const disconnect = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clearDatabase = async (): Promise<void> => {
  const { collections } = mongoose.connection;

  const promises = Object.values(collections).map(async (collection) =>
    collection.deleteMany({}),
  );

  await Promise.all(promises);
};

export { connect, disconnect, clearDatabase };
