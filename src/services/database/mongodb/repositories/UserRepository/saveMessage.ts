import { logger } from '@shared/logger';
import { Message as IMessage } from '@shared/interfaces';
import Message from '../../models/Message';

const saveMessage = async (message: IMessage): Promise<void> => {
  const { userEmail, receivedAt } = message;
  logger.info('Saving message...', { userEmail, receivedAt });

  await Message.create(message);

  logger.info('Successfully saved message.');
};

export default saveMessage;
