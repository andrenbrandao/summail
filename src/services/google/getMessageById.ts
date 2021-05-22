import { google } from 'googleapis';

import { Message } from '@shared/interfaces';

const getMessageById = async (
  accessToken: string,
  messageId: string,
): Promise<Message> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
  );

  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const { data } = await gmail.users.messages.get({
    id: messageId,
    userId: 'me',
    format: 'raw',
  });

  const { id, internalDate, ...otherProps } = data;

  return {
    ...otherProps,
    externalId: id,
    receivedAt: new Date(Number(internalDate)),
  };
};

export default getMessageById;
