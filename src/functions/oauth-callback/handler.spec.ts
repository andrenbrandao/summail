import type { Context, Callback } from 'aws-lambda';
import { getTokensFromCode, getEmailAddress } from '@services/google';
import { main as handler } from './handler';

import mockEvent from './mock.json';

jest.mock('@services/google/getTokensFromCode');
jest.mock('@services/google/getEmailAddress');

const mockedGetTokensFromCode = getTokensFromCode as jest.MockedFunction<
  typeof getTokensFromCode
>;

const mockedGetEmailAddress = getEmailAddress as jest.MockedFunction<
  typeof getEmailAddress
>;

process.env.OAUTH_CLIENT_ID = 'client-id';
process.env.OAUTH_CLIENT_SECRET = 'client-secret';
process.env.OAUTH_REDIRECT_URI = 'http://localhost:4000/dev/oauth-callback';
process.env.OAUTH_URI = 'https://accounts.google.com/o/oauth2/auth';

describe('when a get request is made', () => {
  it('should redirect to the oauth url with client_id and scope as query params', async () => {
    const event = mockEvent;
    const context = {} as Context;
    const callback = null as Callback;

    mockedGetTokensFromCode.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    mockedGetEmailAddress.mockResolvedValue('user@gmail.com');

    const response = await handler(event, context, callback);

    expect(mockedGetTokensFromCode).toHaveBeenCalledWith('auth-code');

    expect(response).toMatchObject({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully authenticated with Google Account.',
        user: 'user@gmail.com',
      }),
    });
  });
});
