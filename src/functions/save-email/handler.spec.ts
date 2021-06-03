import type { Context, Callback } from 'aws-lambda';
import { getConnection } from '@libs/mongodb';
import { main as handler } from './handler';
import { getUserAndSaveMessages } from './getUserAndSaveMessages';

import mockEvent from './mock.json';

jest.mock('@libs/mongodb');
jest.mock('./getUserAndSaveMessages');

const mockedGetUserAndSaveMessages = getUserAndSaveMessages as jest.MockedFunction<
  typeof getUserAndSaveMessages
>;

it('should create a connection to mongodb', async () => {
  const event = mockEvent;
  const context = {} as Context;
  const callback = null as Callback;

  await handler(event, context, callback);

  expect(getConnection).toHaveBeenCalledWith();
});

it('should call getUserAndSaveMessages with the emailAddress and historyId of the user', async () => {
  const event = mockEvent;
  const context = {} as Context;
  const callback = null as Callback;

  await handler(event, context, callback);

  expect(mockedGetUserAndSaveMessages).toHaveBeenCalledWith(
    'user@email.com',
    123456,
  );
});
