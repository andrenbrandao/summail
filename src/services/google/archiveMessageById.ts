import { google } from 'googleapis';
import { logger } from '@shared/logger';

const archiveMessageById = async (
  messageId: string,
  accessToken: string,
): Promise<boolean> => {
  try {
    const gmail = google.gmail({ version: 'v1' });

    await gmail.users.messages.modify({
      id: messageId,
      access_token: accessToken,
      userId: 'me',
      requestBody: {
        removeLabelIds: ['INBOX'],
      },
    });

    return true;
  } catch (error) {
    logger.error('Could not archive message.');
    logger.error(error);
    return false;
  }
};

export default archiveMessageById;
