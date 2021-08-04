import 'source-map-support/register';

import type { ScheduledHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';
import { getUser } from '@services/database/mongodb/repositories/UserRepository';
import { keepMailboxSubscription } from '@services/google';

const keepPubSubAlive: ScheduledHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const { email, refreshToken } = await getUser('johndoe@gmail.com');
  logger.info(`Keeping Mailbox Subscription alive for: ${email}`);
  await keepMailboxSubscription(refreshToken);
};

export const main = middyfy(keepPubSubAlive);
