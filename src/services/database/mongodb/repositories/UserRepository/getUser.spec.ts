/* eslint-disable no-underscore-dangle */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';
import { getUser, saveUser, updateLastHistoryId } from '.';

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

it('should fetch a user with a decrypted refresh token', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const user = await getUser('user@email.com');
  expect(user.email).toEqual('user@email.com');
  expect(user.refreshToken).toEqual('refresh-token');
});

it('should raise an error if the user does not exist', async () => {
  expect(await User.findOne()).toEqual(null);

  await expect(getUser('user@email.com')).rejects.toThrow();
});

it('should fetch a user with lastHistoryId', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await updateLastHistoryId({
    email: 'user@email.com',
    lastHistoryId: '12345',
  });

  const user = await getUser('user@email.com');
  expect(user.lastHistoryId).toEqual('12345');
});
