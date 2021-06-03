import { saveMessage } from '@services/database/mongodb/repositories/MessageRepository';
import { HistoryMessage } from '@shared/interfaces';
import { getMessageById } from '@services/google';

export async function saveUserLastMessages(
  historyMessages: HistoryMessage[],
  accessToken: string,
  emailAddress: string,
): Promise<void> {
  const messagePromises = historyMessages.map(async (historyMessage) => {
    await getAndSaveMessage(historyMessage);
  });

  await Promise.all(messagePromises);

  async function getAndSaveMessage(historyMessage: HistoryMessage) {
    const message = await getMessageById(accessToken, historyMessage.id);
    await saveMessage({ ...message, userEmail: emailAddress });
  }
}
