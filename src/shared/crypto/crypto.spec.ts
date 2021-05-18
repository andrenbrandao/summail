import { encrypt, decrypt } from './crypto';

it('should be able to encrypt a value', () => {
  const value =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.';

  const encrypted = encrypt(value);
  expect(value).not.toEqual(encrypted);
});

it('should be able to decrypt a value', () => {
  const value =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.';

  const encrypted = encrypt(value);
  const decrypted = decrypt(encrypted);

  expect(decrypted).toEqual(value);
});
