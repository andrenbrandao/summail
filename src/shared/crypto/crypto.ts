import crypto from 'crypto';

const secretKey = process.env.CRYPTO_SECRET_KEY;
const key = crypto.createHash('sha256').update(secretKey).digest();

const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes256', key, iv);

  const encrypted =
    cipher.update(text, 'utf8', 'base64') + cipher.final('base64');

  const encryptedIvWithValue = `${iv.toString('hex')}:${encrypted}`;
  return encryptedIvWithValue;
};

const decrypt = (text: string): string => {
  const [iv, data] = text.split(':');
  const decipher = crypto.createDecipheriv(
    'aes256',
    key,
    Buffer.from(iv, 'hex'),
  );

  const decrypted =
    decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');

  return decrypted;
};

export { encrypt, decrypt };
