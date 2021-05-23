/* eslint-disable no-underscore-dangle */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';
import updateLastHistoryId from './updateLastHistoryId';

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

it('should update user with lastHistoryId', async () => {
  const user = await User.create({
    email: 'user@email.com',
    refreshToken: '12345',
  });

  expect(user.lastHistoryId).toBeUndefined();

  await updateLastHistoryId({
    email: 'user@email.com',
    lastHistoryId: '12345',
  });

  const updatedUser = await User.findOne();
  expect(updatedUser.lastHistoryId).toEqual('12345');
});

it('should throw error if it fails to update', async () => {
  jest
    .spyOn(User, 'updateOne')
    .mockResolvedValue({ n: 0, ok: 0, nModified: 0 });

  await expect(
    updateLastHistoryId({
      email: 'user@email.com',
      lastHistoryId: '12345',
    }),
  ).rejects.toThrow('Could not update lastHistoryId.');
});
