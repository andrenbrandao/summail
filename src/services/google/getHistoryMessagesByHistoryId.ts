import { google, Common } from 'googleapis';
import { logger } from '@shared/logger';

import { HistoryMessage } from '@shared/interfaces';

const getHistoryMessagesByHistoryId = async (
  accessToken: string,
  historyId: string,
): Promise<HistoryMessage[]> => {
  if (!historyId) {
    return [];
  }

  try {
    const messages = await partialSyncMessages(accessToken, historyId);
    return messages;
  } catch (error: unknown) {
    if (error instanceof Common.GaxiosError && error.status === 404) {
      logger.warn(
        'Could not use historyId to fetch messages. Doing a full sync.',
      );
      return fullSyncMessages(accessToken);
    }
    logger.error(error);
    throw error;
  }
};

async function partialSyncMessages(accessToken, historyId) {
  const gmail = google.gmail({ version: 'v1' });
  const response = await gmail.users.history.list({
    startHistoryId: historyId,
    historyTypes: ['MESSAGE_ADDED'],
    userId: 'me',
    access_token: accessToken,
  });
  logger.info({ status: response.status, data: response.data });

  if (!response.data.history) {
    logger.warn(
      `No messages were returned. Ignoring historyId ${historyId} to enable future calls.`,
    );
    return [];
  }

  const messagesAdded = response.data.history.flatMap(
    (history) => history.messagesAdded,
  );
  const messages = messagesAdded.map((messageAdded) => messageAdded.message);

  return messages;
}

async function fullSyncMessages(accessToken) {
  logger.info('Full syncing messages...');
  const gmail = google.gmail({ version: 'v1' });
  const response = await gmail.users.messages.list({
    userId: 'me',
    access_token: accessToken,
  });
  logger.info({ status: response.status, data: response.data });

  if (!response.data.messages) {
    logger.warn(`No messages were returned`);
    return [];
  }

  return response.data.messages;
}

export default getHistoryMessagesByHistoryId;
