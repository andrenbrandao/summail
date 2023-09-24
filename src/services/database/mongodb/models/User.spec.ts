/* eslint-disable no-underscore-dangle */
import User from './User';

it('should be able to create a new user', async () => {
  await User.create({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  const userStored = await User.findOne();

  expect(userStored.email).toEqual('user@email.com');
});

it('should fail if tries to create a new one with the same email', async () => {
  await User.create({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await expect(
    User.create({
      email: 'user@email.com',
      refreshToken: 'different-refresh-token',
    }),
  ).rejects.toThrow(/duplicate key error/);
});

it('should be able to update the lastHistoryId', async () => {
  await User.create({
    email: 'user@email.com',
    refreshToken: 'refresh-token',
  });

  await User.updateOne(
    { email: 'user@email.com' },
    { $set: { lastHistoryId: '12345' } },
  );

  const user = await User.findOne();

  expect(user.lastHistoryId).toEqual('12345');
});
