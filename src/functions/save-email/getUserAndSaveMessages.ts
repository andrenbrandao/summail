import {
  getUser,
  updateLastHistoryId,
} from '@services/database/mongodb/repositories/UserRepository';
import {
  refreshAccessToken,
  getHistoryMessagesByHistoryId,
} from '@services/google';
import { saveUserLastMessages } from './saveUserLastMessages';

export async function getUserAndSaveMessages(
  emailAddress: string,
  historyId: string,
): Promise<void> {
  const { refreshToken, lastHistoryId } = await getUser(emailAddress);

  const accessToken = await refreshAccessToken(refreshToken);

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
