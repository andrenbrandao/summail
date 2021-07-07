import { Message as IMessage } from '@shared/interfaces';

const messageMock: IMessage = {
  userEmail: 'user@gmail.com',
  from: 'sender@company.com',
  to: 'user+newsletter@gmail.com',
  externalId: 'external-id',
  historyId: '12345',
  labelIds: ['INBOX', 'UNREAD'],
  raw:
    'PCFkb2N0eXBlIGh0bWw+DQo8aHRtbD4NCiAgPGhlYWQ+DQogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCIgLz4NCiAgICA8bWV0YSBodHRwLWVxdWl2PSJDb250ZW50LVR5cGUiIGNvbnRlbnQ9InRleHQvaHRtbDsgY2hhcnNldD1VVEYtOCIgLz4NCiAgICA8dGl0bGU+U2ltcGxlIFRyYW5zYWN0aW9uYWwgRW1haWw8L3RpdGxlPg0KICA8L2hlYWQ+DQogIDxib2R5Pg0KICAgIDxoMT5TaW1wbGUgZW1haWwuPC9oMT4NCiAgPC9ib2R5Pg0KPC9odG1sPg==',
  sizeEstimate: 62682,
  snippet: 'This is a simple email',
  threadId: '180d306c9d93d751',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
};

export default messageMock;
