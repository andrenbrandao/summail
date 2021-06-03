import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';
import { Notification } from '@shared/interfaces';

import { getUserAndSaveMessages } from './getUserAndSaveMessages';

const saveEmail: SQSHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const promises = event.Records.map(async (record) => {
    const { emailAddress, historyId }: Notification = JSON.parse(record.body);
    await getUserAndSaveMessages(emailAddress, historyId);
  });

  await Promise.all(promises);
};

export const main = middyfy(saveEmail);
