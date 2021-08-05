import { logger } from '@shared/logger';
import User, { IUser } from '@services/database/mongodb/models/User';

import { decrypt } from '@shared/crypto';

const getUsers = async (): Promise<IUser[]> => {
  const users = await User.find({}, { email: 1, refreshToken: 1 }).lean();

  logger.info('Getting all users...');
  logger.info(users.map((user) => user.email));

  const decryptedUsers = users.map((user) => ({
    ...user,
    refreshToken: decrypt(user.refreshToken),
  }));

  return decryptedUsers;
};

export default getUsers;
