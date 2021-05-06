/* eslint-disable no-underscore-dangle */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './User';

jest.mock('@libs/mongodb');

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, opts);
  } catch (error) {
    console.error(error);
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('should be able to create a new user', async () => {
  await User.create({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const userStored = await User.findOne();

  expect(userStored.email).toEqual('user@email.com');
});

it('should fail if tries to create a new one with the same email', async () => {
  await User.create({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await expect(
    User.create({
      email: 'user@email.com',
      refreshToken: 'different-refresh-token',
    }),
  ).rejects.toThrow(
    'E11000 duplicate key error dup key: { : "user@email.com" }',
  );
});
