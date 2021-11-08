import { saveMessage } from '@services/database/mongodb/repositories/MessageRepository';
import { HistoryMessage, Message } from '@shared/interfaces';
import { getMessageById } from '@services/google';
import { hasSuffixNewsletter } from './hasSuffixNewsletter';

export async function saveUserLastMessages(
  historyMessages: HistoryMessage[],
  accessToken: string,
  emailAddress: string,
): Promise<Message[]> {
  const messagePromises = historyMessages.map(async (historyMessage) => {
    const getMessageDTO = await getMessageById(accessToken, historyMessage.id);
    const message: Message = { ...getMessageDTO, userEmail: emailAddress };
    return message;
  });

  const messages = await Promise.all(messagePromises);

  const filteredMessages = messages.filter((message) =>
    hasSuffixNewsletter(emailAddress, message),
  );

  const saveMessagePromises = filteredMessages.map(async (message) => {
    await saveMessage(message);
  });

  await Promise.all(saveMessagePromises);
  return filteredMessages;
}
