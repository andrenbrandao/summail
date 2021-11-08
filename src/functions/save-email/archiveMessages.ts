import { Message } from '@shared/interfaces';
import { archiveMessageById } from '@services/google';

export async function archiveMessages(
  messages: Message[],
  accessToken: string,
): Promise<void> {
  const messagePromises = messages.map(async (message) => {
    await archiveMessageById(message.externalId, accessToken);
  });

  await Promise.all(messagePromises);
}
