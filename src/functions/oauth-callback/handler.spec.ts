import type { Context, Callback } from 'aws-lambda';
import { getTokensFromCode, getEmailAddress } from '@services/google';
import { getConnection } from '@libs/mongodb';
import { createUser } from '@services/database/mongodb/repositories/UserRepository';
import { main as handler } from './handler';

import mockEvent from './mock.json';

jest.mock('@services/google/getTokensFromCode');
jest.mock('@services/google/getEmailAddress');
jest.mock('@libs/mongodb');
jest.mock('@services/database/mongodb/repositories/UserRepository/createUser');

const mockedGetTokensFromCode = getTokensFromCode as jest.MockedFunction<
  typeof getTokensFromCode
>;

const mockedGetEmailAddress = getEmailAddress as jest.MockedFunction<
  typeof getEmailAddress
>;

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

  it('should create a connection to mongodb', async () => {
    const event = mockEvent;
    const context = {} as Context;
    const callback = null as Callback;

    await handler(event, context, callback);

    expect(getConnection).toHaveBeenCalledWith();
  });

  it('should call create user method with email and refresh token', async () => {
    const event = mockEvent;
    const context = {} as Context;
    const callback = null as Callback;

    mockedGetTokensFromCode.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    mockedGetEmailAddress.mockResolvedValue('user@gmail.com');

    await handler(event, context, callback);

    expect(createUser).toHaveBeenCalledWith({
      email: 'user@gmail.com',
      refreshToken: 'refresh-token',
    });
  });
});
