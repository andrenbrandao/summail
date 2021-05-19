import { google } from 'googleapis';

import { Message } from '@shared/interfaces';

const getMessagesByHistoryId = async (
  accessToken: string,
  historyId: string,
): Promise<Message[]> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
  );

  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const response = await gmail.users.history.list({
    startHistoryId: historyId,
    historyTypes: ['MESSAGE_ADDED'],
    userId: 'me',
  });

  const messagesAdded = response.data.history.flatMap(
    (history) => history.messagesAdded,
  );
  const messages = messagesAdded.map((messageAdded) => messageAdded.message);

  return messages;
};

export default getMessagesByHistoryId;
