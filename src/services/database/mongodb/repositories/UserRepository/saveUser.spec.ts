/* eslint-disable no-underscore-dangle */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';
import saveUser from './saveUser';

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

it('should create if does not yet exist', async () => {
  const firstUsers = await User.find();

  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const users = await User.find();

  expect(firstUsers.length).toEqual(0);
  expect(users.length).toEqual(1);
});

it('should encrypt the refresh token', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const userStored = await User.findOne();

  expect(userStored.refreshToken).not.toEqual('refresh-token');
});

it('should update user with the same email', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await saveUser({
    email: 'user@email.com',
    refreshToken: 'different-refresh-token',
  });

  const users = await User.find();
  expect(users.length).toEqual(1);
});

it('should throw error if it fails to upsert', async () => {
  jest
    .spyOn(User, 'updateOne')
    .mockResolvedValue({ n: 0, ok: 0, nModified: 0 });

  await expect(
    saveUser({
      email: 'user@email.com',
      refreshToken: 'refresh-token',
    }),
  ).rejects.toThrow('Could not update or upsert user.');
});
