import { logger } from '@shared/logger';
import { Message as IMessage } from '@shared/interfaces';
import { IUser } from '@services/database/mongodb/models/User';
import { subWeeks } from 'date-fns';
import { today } from '@shared/utils';
import Message from '../../models/Message';

const getUserLastWeekMessages = async (
  userEmail: IUser['email'],
): Promise<IMessage[]> => {
  logger.info("Getting last week's messages of user: ", { userEmail });

  const lastWeekDay = subWeeks(today(), 1);
  const messages = await Message.find({
    userEmail,
    receivedAt: {
      $gte: lastWeekDay,
    },
  });
  return messages;
};

export default getUserLastWeekMessages;
