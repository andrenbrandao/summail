/* eslint-disable no-underscore-dangle */
import User from '../../models/User';
import saveUser from './saveUser';

it('should create if does not yet exist', async () => {
  const firstUsers = await User.find();

  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const users = await User.find();

  expect(firstUsers.length).toEqual(0);
  expect(users.length).toEqual(1);
});

it('should encrypt the refresh token', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const userStored = await User.findOne();

  expect(userStored.refreshToken).not.toEqual('refresh-token');
});

it('should update user with the same email', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const oldUser = await User.findOne();

  await saveUser({
    email: 'user@email.com',
    refreshToken: 'different-refresh-token',
  });

  const user = await User.findOne();
  expect(user.refreshToken).not.toEqual(oldUser.refreshToken);
});

it('should throw error if it fails to upsert', async () => {
  jest
    .spyOn(User, 'updateOne')
    .mockResolvedValue({ n: 0, ok: 0, nModified: 0 });

  await expect(
    saveUser({
      email: 'user@email.com',
      refreshToken: 'refresh-token',
    }),
  ).rejects.toThrow('Could not update or upsert user.');
});
