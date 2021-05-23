import { logger } from '@shared/logger';
import { Message as IMessage } from '@shared/interfaces';
import Message from '../../models/Message';

const saveMessage = async (message: IMessage): Promise<void> => {
  const { userEmail, receivedAt, externalId } = message;
  logger.info('Saving message...', { userEmail, receivedAt, externalId });

  const result = await Message.updateOne({ externalId }, message, {
    upsert: true,
  });

  if (!result.ok) {
    throw new Error('Could not update or upsert message.');
  }

  logger.info('Successfully updated/upserted message.');
};

export default saveMessage;
