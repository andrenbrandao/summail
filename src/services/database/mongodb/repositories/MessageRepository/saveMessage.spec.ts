/* eslint-disable no-underscore-dangle */
import { messageMock } from '@shared/__mocks__';
import Message from '../../models/Message';
import saveMessage from './saveMessage';

it('should create if does not yet exist', async () => {
  await saveMessage(messageMock);

  const messages = await Message.find();
  expect(messages.length).toEqual(1);
});

it('should update an existing message', async () => {
  const updateData = { ...messageMock, raw: 'new-data' };

  await saveMessage(messageMock);
  await saveMessage(updateData);

  const message = await Message.findOne();
  expect(message.raw).toEqual('new-data');
});

it('should throw error if it fails to upsert', async () => {
  jest
    .spyOn(Message, 'updateOne')
    .mockResolvedValue({ n: 0, ok: 0, nModified: 0 });

  await expect(saveMessage(messageMock)).rejects.toThrow(
    'Could not update or upsert message.',
  );
});
