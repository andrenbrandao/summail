import 'source-map-support/register';

import type { ScheduledHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';

const readLastWeeksEmails: ScheduledHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();
};

export const main = middyfy(readLastWeeksEmails);
