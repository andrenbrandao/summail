import {
  getUser,
  updateLastHistoryId,
} from '@services/database/mongodb/repositories/UserRepository';
import {
  refreshAccessToken,
  getHistoryMessagesByHistoryId,
} from '@services/google';
import { logger } from '@shared/logger';
import { saveUserLastMessages } from './saveUserLastMessages';

export async function getUserAndSaveMessages(
  emailAddress: string,
  historyId: string,
): Promise<void> {
  const { email, refreshToken, lastHistoryId } = await getUser(emailAddress);

  const accessToken = await refreshAccessToken(refreshToken);

  logger.info(
    `Querying history for ${email} with startHistoryId: ${lastHistoryId}`,
  );
  const historyMessages = await getHistoryMessagesByHistoryId(
    accessToken,
    lastHistoryId,
  );

  await saveUserLastMessages(historyMessages, accessToken, emailAddress);
  await updateLastHistoryId({
    email: emailAddress,
    lastHistoryId: historyId,
  });
}
