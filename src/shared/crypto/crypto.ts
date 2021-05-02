import crypto from 'crypto';

const secretKey = process.env.CRYPTO_SECRET_KEY;
const key = crypto.createHash('sha256').update(secretKey).digest();

const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes256', key, iv);

  cipher.update(text, 'utf8', 'base64');
  const encryptedPassword = cipher.final('base64');

  return `${iv.toString('hex')}:${encryptedPassword}`;
};

const decrypt = (text: string): string => {
  const [iv, data] = text.split(':');
  const decipher = crypto.createDecipheriv(
    'aes256',
    key,
    Buffer.from(iv, 'hex'),
  );

  decipher.update(data, 'base64', 'utf8');
  const decrypted = decipher.final('utf8');

  return decrypted;
};

export { encrypt, decrypt };
