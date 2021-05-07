import type { Context, Callback } from 'aws-lambda';
import { main as handler } from './handler';

import mockEvent from './mock.json';

it('should log base64-encoded data', async () => {
  const event = mockEvent;
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
