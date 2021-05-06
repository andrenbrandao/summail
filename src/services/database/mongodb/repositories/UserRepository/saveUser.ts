import { logger } from '@shared/logger';
import User, { IUser } from '@services/database/mongodb/models/User';

import { encrypt } from '@shared/crypto';

const saveUser = async (user: IUser): Promise<void> => {
  const { email, refreshToken } = user;

  const encryptedRefreshToken = encrypt(refreshToken);

  logger.info('Saving user...', { email, encryptedRefreshToken });
  const result = await User.updateOne(
    { email },
    { refreshToken: encryptedRefreshToken },
    { upsert: true },
  );

  if (!result.ok) {
    throw Error('Could not update or upsert user.');
  }

  logger.info('Successfully updated/upserted user');
};

export default saveUser;
