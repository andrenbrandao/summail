import { logger } from '@shared/logger';
import User, { IUser } from '../../models/User';

interface UpdateLastHistoryIdDTO {
  email: IUser['email'];
  lastHistoryId: IUser['lastHistoryId'];
}

const updateLastHistoryId = async ({
  email,
  lastHistoryId,
}: UpdateLastHistoryIdDTO): Promise<void> => {
  logger.info('Updating lastHistoryId', { email, lastHistoryId });
  const result = await User.updateOne({ email }, { $set: { lastHistoryId } });

  if (!result.ok) {
    throw new Error('Could not update lastHistoryId.');
  }

  logger.info('Successfully updated lastHistoryId.');
};

export default updateLastHistoryId;
