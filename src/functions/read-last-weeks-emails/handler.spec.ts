import type { Context, Callback } from 'aws-lambda';
import { sendMessage } from '@services/sqs';
import { saveUser } from '@services/database/mongodb/repositories/UserRepository';
import { saveMessage } from '@services/database/mongodb/repositories/MessageRepository';
import { generateMessage } from '@shared/__mocks__';
import { main as handler } from './handler';

jest.mock('@services/sqs');

const mockedSendMessage = sendMessage as jest.MockedFunction<
  typeof sendMessage
>;

jest.mock('@shared/utils/today', () => ({
  __esModule: true,
  default: () => new Date('2021-05-22T15:00:00Z'),
}));

const firstUserEmailSameDay = generateMessage({
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
});

const firstUserEmailOneWeekBefore = generateMessage({
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-15T16:00:00Z'),
});

const secondUserEmailSameDay = generateMessage({
  userEmail: 'janeroe@gmail.com',
  to: 'janeroe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
});

const thirdUserEmailLaterThanOneWeekBefore = generateMessage({
  userEmail: 'markzuck@gmail.com',
  to: 'markzuck+newsletter@gmail.com',
  receivedAt: new Date('2021-05-14T15:00:00Z'),
});

const fourthUserEmailWithoutNewsletterSuffix = generateMessage({
  userEmail: 'zackwill@gmail.com',
  to: 'zackwill@gmail.com',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
});

beforeEach(async () => {
  await saveUser({ email: 'johndoe@gmail.com', refreshToken: 'token-100' });
  await saveUser({ email: 'janeroe@gmail.com', refreshToken: 'token-200' });
  await saveUser({ email: 'markzuck@gmail.com', refreshToken: 'token-300' });
  await saveUser({ email: 'zackwill@gmail.com', refreshToken: 'token-400' });

  await saveMessage({ ...firstUserEmailSameDay });
  await saveMessage({ ...firstUserEmailOneWeekBefore });

  await saveMessage({ ...secondUserEmailSameDay });

  await saveMessage({ ...thirdUserEmailLaterThanOneWeekBefore });
  await saveMessage({ ...fourthUserEmailWithoutNewsletterSuffix });
});

describe("Read Last Week's Emails", () => {
  it('should send last week emails ordered by date to the queue', async () => {
    const event = {};
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);

    expect(mockedSendMessage).toHaveBeenCalledWith({
      MessageBody: expect.any(String),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/message-processing-queue',
    });

    // First user's messages should be sent
    const expectedFirstEmail = {
      ...firstUserEmailOneWeekBefore,
      receivedAt: firstUserEmailOneWeekBefore.receivedAt.toISOString(),
    };
    const expectedSecondEmail = {
      ...firstUserEmailSameDay,
      receivedAt: firstUserEmailSameDay.receivedAt.toISOString(),
    };
    const messageBody = mockedSendMessage.mock.calls[0][0].MessageBody;
    expect(JSON.parse(messageBody)).toMatchObject({
      emailAddress: 'johndoe@gmail.com',
      messages: [expectedFirstEmail, expectedSecondEmail],
    });

    // Second user's messages should also be sent
    const expectedSecondUserFirstEmail = {
      ...secondUserEmailSameDay,
      receivedAt: secondUserEmailSameDay.receivedAt.toISOString(),
    };
    const secondMessageBody = mockedSendMessage.mock.calls[1][0].MessageBody;
    expect(JSON.parse(secondMessageBody)).toMatchObject({
      emailAddress: 'janeroe@gmail.com',
      messages: [expectedSecondUserFirstEmail],
    });
  });

  it('should not send data to the queue for users who do not have messages in the last week', async () => {
    const event = {};
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);

    expect(mockedSendMessage).not.toHaveBeenCalledWith({
      MessageBody: expect.stringMatching(/markzuck@gmail.com/),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/message-processing-queue',
    });
  });

  it('should not send emails that do not have a newsletter suffix', async () => {
    const event = {};
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);

    expect(mockedSendMessage).not.toHaveBeenCalledWith({
      MessageBody: expect.stringMatching(/zackwill@gmail.com/),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/message-processing-queue',
    });
  });
});
