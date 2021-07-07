/* eslint-disable no-underscore-dangle */
import { messageMock } from '@shared/__mocks__';
import Message from './Message';

it('should be able to create a new message', async () => {
  await Message.create(messageMock);
  const message = await Message.findOne().lean();

  expect(message).toMatchObject(messageMock);
});

it('should not create message without userEmail', async () => {
  const invalidMessage = {
    ...messageMock,
    userEmail: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `userEmail` is required./,
  );
});

it('should not create message with same externalId', async () => {
  await Message.create(messageMock);

  await expect(Message.create(messageMock)).rejects.toThrowError(
    /E11000 duplicate key error dup key: { : "external-id" }/,
  );
});

it('should not create message without externalId', async () => {
  const invalidMessage = {
    ...messageMock,
    externalId: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `externalId` is required./,
  );
});

it('should not create message without raw', async () => {
  const invalidMessage = {
    ...messageMock,
    raw: undefined,
  };

  await expect(Message.create(invalidMessage)).rejects.toThrowError(
    /Path `raw` is required./,
  );
});
