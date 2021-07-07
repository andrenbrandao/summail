/* eslint-disable camelcase */
import { gmail_v1 } from 'googleapis';
import rawMessageMock from '@shared/__mocks__/rawMessageMock';

import getMessageById from './getMessageById';

jest
  .spyOn(gmail_v1.Resource$Users$Messages.prototype, 'get')
  .mockImplementation(() => Promise.resolve({ data: rawMessageMock }));

describe('when fetching a message from the gmail API', () => {
  it('should save the id as an externalId', async () => {
    const message = await getMessageById('access-token', '180d306c9d93d751');
    expect(message.externalId).toEqual('180d306c9d93d751');
  });

  it('should convert the internalDate to a receivedAt Date', async () => {
    const message = await getMessageById('access-token', '180d306c9d93d751');
    expect(message.receivedAt).toEqual(new Date(1621695600));
  });

  it('should save the "from" email header', async () => {
    const message = await getMessageById('access-token', '180d306c9d93d751');
    expect(message.from).toEqual('sender@company.com');
  });

  it('should save the "to" email header', async () => {
    const message = await getMessageById('access-token', '180d306c9d93d751');
    expect(message.to).toEqual('user+newsletter@gmail.com');
  });
});
