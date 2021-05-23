/* eslint-disable no-underscore-dangle */
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Message as IMessage } from '@shared/interfaces';
import Message from '../../models/Message';
import saveMessage from './saveMessage';

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
  await Message.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const messageData: IMessage = {
  userEmail: 'user@email.com',
  externalId: 'external-id',
  historyId: '12345',
  labelIds: ['INBOX', 'UNREAD'],
  raw:
    'PCFkb2N0eXBlIGh0bWw+DQo8aHRtbD4NCiAgPGhlYWQ+DQogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCIgLz4NCiAgICA8bWV0YSBodHRwLWVxdWl2PSJDb250ZW50LVR5cGUiIGNvbnRlbnQ9InRleHQvaHRtbDsgY2hhcnNldD1VVEYtOCIgLz4NCiAgICA8dGl0bGU+U2ltcGxlIFRyYW5zYWN0aW9uYWwgRW1haWw8L3RpdGxlPg0KICA8L2hlYWQ+DQogIDxib2R5Pg0KICAgIDxoMT5TaW1wbGUgZW1haWwuPC9oMT4NCiAgPC9ib2R5Pg0KPC9odG1sPg==',
  sizeEstimate: 62682,
  snippet: 'This is a simple email',
  threadId: '555',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
};

it('should create if does not yet exist', async () => {
  await saveMessage(messageData);

  const messages = await Message.find();
  expect(messages.length).toEqual(1);
});

it('should throw error if create fails', async () => {
  jest
    .spyOn(Message, 'create')
    .mockImplementation(() =>
      Promise.reject(new Error('Failed to create message')),
    );

  await expect(saveMessage(messageData)).rejects.toThrow(
    'Failed to create message',
  );
});
