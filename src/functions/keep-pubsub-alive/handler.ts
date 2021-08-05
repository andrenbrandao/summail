import 'source-map-support/register';

import type { ScheduledHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';
import { getUsers } from '@services/database/mongodb/repositories/UserRepository';
import { keepMailboxSubscription } from '@services/google';

const keepPubSubAlive: ScheduledHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const users = await getUsers();

  const promises = users.map(async (user) => {
    const { email, refreshToken } = user;

    logger.info(`Keeping Mailbox Subscription alive for: ${email}`);
    await keepMailboxSubscription(refreshToken);
  });

  await Promise.all(promises);
};

export const main = middyfy(keepPubSubAlive);
