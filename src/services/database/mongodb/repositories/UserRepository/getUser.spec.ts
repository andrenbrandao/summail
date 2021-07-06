/* eslint-disable no-underscore-dangle */
import User from '../../models/User';
import { getUser, saveUser, updateLastHistoryId } from '.';

it('should fetch a user with a decrypted refresh token', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const user = await getUser('user@email.com');
  expect(user.email).toEqual('user@email.com');
  expect(user.refreshToken).toEqual('refresh-token');
});

it('should raise an error if the user does not exist', async () => {
  expect(await User.findOne()).toEqual(null);

  await expect(getUser('user@email.com')).rejects.toThrow();
});

it('should fetch a user with lastHistoryId', async () => {
  await saveUser({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await updateLastHistoryId({
    email: 'user@email.com',
    lastHistoryId: '12345',
  });

  const user = await getUser('user@email.com');
  expect(user.lastHistoryId).toEqual('12345');
});
