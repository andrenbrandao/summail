import type { Context, Callback } from 'aws-lambda';
import { sendMessage } from '@services/sqs';
import { main as handler } from './handler';

import mockEvent from './mock.json';

jest.mock('@services/sqs');

const mockedSendMessage = sendMessage as jest.MockedFunction<
  typeof sendMessage
>;

it('should log base64-encoded data', async () => {
  const event = { ...mockEvent };
  const context = {} as Context;
  const callback = null as Callback;

  const response = await handler(event, context, callback);

  expect(response).toMatchObject({
    statusCode: 200,
    body: JSON.stringify({
      emailAddress: 'user@example.com',
      historyId: '1234567890',
    }),
  });
});

it('should call sqs sendMessage with notification data', async () => {
  const event = { ...mockEvent };
  const context = {} as Context;
  const callback = null as Callback;

  await handler(event, context, callback);

  expect(mockedSendMessage).toHaveBeenCalledWith({
    MessageBody: JSON.stringify({
      emailAddress: 'user@example.com',
      historyId: '1234567890',
    }),
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/queue',
    MessageGroupId: 'user@example.com',
  });
});
