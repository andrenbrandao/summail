import { logger } from '@shared/logger';
import User, { IUser } from '@services/database/mongodb/models/User';

import { encrypt } from '@shared/crypto';

const saveUser = async (
  user: Pick<IUser, 'email' | 'refreshToken'>,
): Promise<void> => {
  const { email, refreshToken } = user;

  let result;
  logger.info('Saving user...', { email });

  if (refreshToken) {
    const encryptedRefreshToken = encrypt(refreshToken);
    result = await User.updateOne(
      { email },
      { refreshToken: encryptedRefreshToken },
      { upsert: true },
    );
  } else {
    result = await User.updateOne({ email }, { email }, { upsert: true });
  }

  if (!result.ok) {
    throw new Error('Could not update or upsert user.');
  }

  logger.info('Successfully updated/upserted user');
};

export default saveUser;
