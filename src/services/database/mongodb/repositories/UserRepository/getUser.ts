import { logger } from '@shared/logger';
import User, { IUser } from '@services/database/mongodb/models/User';

import { decrypt } from '@shared/crypto';

const getUser = async (email: IUser['email']): Promise<IUser> => {
  const user = await User.findOne({ email }).lean();

  if (!user) {
    throw new Error('User not found!');
  }

  logger.info('Reading user: ', { email: user.email });
  const decryptedRefreshToken = decrypt(user.refreshToken);

  return {
    email: user.email,
    refreshToken: decryptedRefreshToken,
    lastHistoryId: user.lastHistoryId,
  };
};

export default getUser;
