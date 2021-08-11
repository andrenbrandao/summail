/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnection } from '@libs/mongodb';

jest.mock('@libs/mongodb');
const mockedGetConnection = getConnection as jest.MockedFunction<
  typeof getConnection
>;

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

let mongoServer: MongoMemoryServer;
const opts: ConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connect = async (): Promise<void> => {
  mongoServer = new MongoMemoryServer({
    instance: { dbName: 'mongodb-test' },
  });
  const mongoUri = await mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, opts);

    mockedGetConnection.mockResolvedValue(mongoose.connection);
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

  Object.values(collections).forEach((collection) => collection.deleteMany({}));
};

export { connect, disconnect, clearDatabase };
