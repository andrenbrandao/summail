import type { Context, Callback } from 'aws-lambda';
import nock from 'nock';
import { saveUser } from '@services/database/mongodb/repositories/UserRepository';

import { main as handler } from './handler';
import mockEvent from './mock.json';

nock('https://gmail.googleapis.com')
  .persist()
  .post('/gmail/v1/users/me/watch', {
    labelIds: ['INBOX'],
    topicName: 'projects/weekly-newsletter-email/topics/gmail-inbox-push-dev',
  })
  .reply(200, {
    historyId: '12345',
    expiration: '1628033144',
  });

nock('https://oauth2.googleapis.com')
  .post(
    '/token',
    'refresh_token=token-100&client_id=client-id&client_secret=client-secret&grant_type=refresh_token',
  )
  .reply(200, {
    accessToken: 'access-token',
  })
  .post(
    '/token',
    'refresh_token=token-200&client_id=client-id&client_secret=client-secret&grant_type=refresh_token',
  )
  .reply(200, {
    accessToken: 'access-token',
  })
  .post(
    '/token',
    'refresh_token=token-300&client_id=client-id&client_secret=client-secret&grant_type=refresh_token',
  )
  .reply(200, {
    accessToken: 'access-token',
  });

beforeEach(async () => {
  await saveUser({ email: 'johndoe@gmail.com', refreshToken: 'token-100' });
  await saveUser({ email: 'janeroe@gmail.com', refreshToken: 'token-200' });
  await saveUser({ email: 'markzuck@gmail.com', refreshToken: 'token-300' });
});

describe('Keep PubSub Alive', () => {
  it('should call gmail watch endpoint with each users access token', async () => {
    const event = mockEvent;
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);
  });
});
