import { Message } from '@shared/interfaces';

export const filterNewsletterMessages = (
  userEmail: string,
  messages: Message[],
): Message[] => {
  const [username, suffix] = userEmail.split('@');

  const emailWithSuffix = `${username}+newsletter@${suffix}`;

  const filteredMessages = messages.filter((message) => {
    if (message.to === emailWithSuffix) {
      return true;
    }
    return false;
  });

  return filteredMessages;
};
