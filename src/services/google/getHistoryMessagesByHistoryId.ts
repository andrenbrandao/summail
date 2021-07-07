import { google } from 'googleapis';

import { HistoryMessage } from '@shared/interfaces';

const getHistoryMessagesByHistoryId = async (
  accessToken: string,
  historyId: string,
): Promise<HistoryMessage[]> => {
  if (!historyId) {
    return [];
  }

  const gmail = google.gmail({ version: 'v1' });

  const response = await gmail.users.history.list({
    startHistoryId: historyId,
    historyTypes: ['MESSAGE_ADDED'],
    userId: 'me',
    access_token: accessToken,
  });

  const messagesAdded = response.data.history.flatMap(
    (history) => history.messagesAdded,
  );
  const messages = messagesAdded.map((messageAdded) => messageAdded.message);

  return messages;
};

export default getHistoryMessagesByHistoryId;
