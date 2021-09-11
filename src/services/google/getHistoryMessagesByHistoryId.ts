import { google } from 'googleapis';
import { logger } from '@shared/logger';

import { HistoryMessage } from '@shared/interfaces';

const getHistoryMessagesByHistoryId = async (
  accessToken: string,
  historyId: string,
): Promise<HistoryMessage[]> => {
  if (!historyId) {
    return [];
  }

  const gmail = google.gmail({ version: 'v1' });

  try {
    const response = await gmail.users.history.list({
      startHistoryId: historyId,
      historyTypes: ['MESSAGE_ADDED'],
      userId: 'me',
      access_token: accessToken,
    });
    logger.info(response);

    const messagesAdded = response.data.history.flatMap(
      (history) => history.messagesAdded,
    );
    const messages = messagesAdded.map((messageAdded) => messageAdded.message);

    return messages;
  } catch (error) {
    logger.error(error);
    logger.error(
      `Gmail returned an error for historyId ${historyId}. It will be ignored to enable future calls.`,
    );
    return [];
  }
};

export default getHistoryMessagesByHistoryId;
