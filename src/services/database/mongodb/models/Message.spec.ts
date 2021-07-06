/* eslint-disable no-underscore-dangle */
import { Message as IMessage } from '@shared/interfaces';
import Message from './Message';

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

it('should be able to create a new message', async () => {
  await Message.create(messageData);
  const message = await Message.findOne().lean();

  expect(message).toMatchObject<IMessage>(messageData);
});

it('should not create message without userEmail', async () => {
  const invalidMessage = {
    ...messageData,
    userEmail: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `userEmail` is required./,
  );
});

it('should not create message with same externalId', async () => {
  await Message.create(messageData);

  await expect(Message.create(messageData)).rejects.toThrowError(
    /E11000 duplicate key error dup key: { : "external-id" }/,
  );
});

it('should not create message without externalId', async () => {
  const invalidMessage = {
    ...messageData,
    externalId: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `externalId` is required./,
  );
});

it('should not create message without raw', async () => {
  const invalidMessage = {
    ...messageData,
    raw: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `raw` is required./,
  );
});
