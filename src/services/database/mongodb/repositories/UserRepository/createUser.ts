import { logger } from '@shared/logger';
import User, {
  IUser,
  IUserModel,
} from '@services/database/mongodb/models/User';

import { encrypt } from '@shared/crypto';

const createUser = async (user: IUser): Promise<IUserModel> => {
  const { email, refreshToken } = user;

  const userWithEncryptedToken = { email, refreshToken: encrypt(refreshToken) };

  logger.info('Saving user...', userWithEncryptedToken);
  const userCreated = await User.create(userWithEncryptedToken);

  logger.info('Successfully created user', userCreated);
  return userCreated;
};

export default createUser;
