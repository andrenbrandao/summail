import { google } from 'googleapis';
import { logger } from '@shared/logger';

const keepMailboxSubscription = async (refreshToken: string): Promise<void> => {
  logger.info('Calling watch on Gmail API');
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
  );

  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const response = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['INBOX'],
      topicName: process.env.GOOGLE_PUBSUB_TOPIC_NAME,
    },
  });
  logger.info(response);
};

export default keepMailboxSubscription;
