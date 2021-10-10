import { Message } from '@shared/interfaces';

export const hasSuffixNewsletter = (
  userEmail: string,
  message: Message,
): boolean => {
  const [username, emailDomain] = userEmail.split('@');

  const emailWithSuffix = `${username}+newsletter@${emailDomain}`;

  return message.to === emailWithSuffix;
};
