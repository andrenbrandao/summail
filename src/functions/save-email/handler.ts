import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';
import { getUser } from '@services/database/mongodb/repositories/UserRepository';
import { Notification } from '@shared/interfaces';

import { refreshAccessToken, getMessagesByHistoryId } from '@services/google';

const saveEmail: SQSHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const promises = event.Records.map(async (record) => {
    const { emailAddress, historyId }: Notification = JSON.parse(record.body);
    console.log(emailAddress, historyId);
    const user = await getUser(emailAddress);
    console.log(user);
    const accessToken = await refreshAccessToken(user.refreshToken);
    console.log(accessToken);
    const messages = await getMessagesByHistoryId(accessToken, historyId);
    console.log(messages);
  });

  await Promise.all(promises);
};

export const main = middyfy(saveEmail);
