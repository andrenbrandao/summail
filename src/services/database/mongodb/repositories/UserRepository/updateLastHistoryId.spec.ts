import User from '../../models/User';
import updateLastHistoryId from './updateLastHistoryId';

it('should update user with lastHistoryId', async () => {
  const user = await User.create({
    email: 'user@email.com',
    refreshToken: '12345',
  });

  expect(user.lastHistoryId).toBeUndefined();

  await updateLastHistoryId({
    email: 'user@email.com',
    lastHistoryId: '12345',
  });

  const updatedUser = await User.findOne();
  expect(updatedUser.lastHistoryId).toEqual('12345');
});

it('should throw error if it fails to update', async () => {
  jest
    .spyOn(User, 'updateOne')
    .mockResolvedValue({ n: 0, ok: 0, nModified: 0 });

  await expect(
    updateLastHistoryId({
      email: 'user@email.com',
      lastHistoryId: '12345',
    }),
  ).rejects.toThrow('Could not update lastHistoryId.');
});
