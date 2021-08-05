/* eslint-disable no-underscore-dangle */
import { getUsers, saveUser } from '.';

it('should get all users with decrypted refresh tokens', async () => {
  await saveUser({
    email: 'johndoe@email.com',
    refreshToken: 'refresh-token-100',
  });

  await saveUser({
    email: 'janeroe@email.com',
    refreshToken: 'refresh-token-200',
  });

  const users = await getUsers();

  expect(users).toStrictEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: 'johndoe@email.com',
        refreshToken: 'refresh-token-100',
      }),
      expect.objectContaining({
        email: 'janeroe@email.com',
        refreshToken: 'refresh-token-200',
      }),
    ]),
  );
});

it('should return an empty array if no users exist', async () => {
  const users = await getUsers();

  expect(users).toStrictEqual([]);
});
