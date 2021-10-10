import { saveMessage } from '@services/database/mongodb/repositories/MessageRepository';
import { HistoryMessage, Message } from '@shared/interfaces';
import { getMessageById } from '@services/google';
import { hasSuffixNewsletter } from './hasSuffixNewsletter';

export async function saveUserLastMessages(
  historyMessages: HistoryMessage[],
  accessToken: string,
  emailAddress: string,
): Promise<void> {
  const messagePromises = historyMessages.map(async (historyMessage) => {
    const getMessageDTO = await getMessageById(accessToken, historyMessage.id);
    const message: Message = { ...getMessageDTO, userEmail: emailAddress };

    if (hasSuffixNewsletter(emailAddress, message)) {
      await saveMessage(message);
    }
  });

  await Promise.all(messagePromises);
}
