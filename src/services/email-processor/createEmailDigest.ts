import { Message } from '@shared/interfaces';

const createEmailDigest = (messages: Message[]): string => {
  const emails = messages.map((message) => {
    const decodedEmail = Buffer.from(message.raw, 'base64').toString();
    return decodedEmail;
  });
  return emails.join(' ');
};

export default createEmailDigest;
