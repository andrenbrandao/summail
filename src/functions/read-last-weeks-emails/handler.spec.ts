import type { Context, Callback } from 'aws-lambda';
import { sendMessage } from '@services/sqs';
import { saveUser } from '@services/database/mongodb/repositories/UserRepository';
import { saveMessage } from '@services/database/mongodb/repositories/MessageRepository';
import { messageMock } from '@shared/__mocks__';
import { main as handler } from './handler';

jest.mock('@services/sqs');

const mockedSendMessage = sendMessage as jest.MockedFunction<
  typeof sendMessage
>;

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2021-05-22T15:00:00Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

const firstUserEmailSameDay = {
  ...messageMock,
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
};

const firstUserEmailOneWeekBefore = {
  ...messageMock,
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-15T15:00:00Z'),
};

const firstUserEmailLaterThanOneWeekBefore = {
  ...messageMock,
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-14T15:00:00Z'),
};

beforeEach(async () => {
  await saveUser({ email: 'johndoe@gmail.com', refreshToken: 'token-100' });
  await saveUser({ email: 'janeroe@gmail.com', refreshToken: 'token-200' });
  await saveUser({ email: 'markzuck@gmail.com', refreshToken: 'token-300' });

  await saveMessage(firstUserEmailSameDay);
  await saveMessage(firstUserEmailOneWeekBefore);
  await saveMessage(firstUserEmailLaterThanOneWeekBefore);
});

describe("Read Last Week's Emails", () => {
  it('should send last week emails ordered by date to the queue', async () => {
    const event = {};
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);

    expect(mockedSendMessage).toHaveBeenCalledWith({
      MessageBody: JSON.stringify({
        emailAddress: 'johndoe@example.com',
        emails: [firstUserEmailOneWeekBefore, firstUserEmailSameDay],
      }),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/message-processing-queue',
    });
  });
});
