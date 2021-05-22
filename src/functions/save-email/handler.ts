import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import { getConnection } from '@libs/mongodb';
import {
  getUser,
  saveMessage,
} from '@services/database/mongodb/repositories/UserRepository';
import { Notification } from '@shared/interfaces';

import {
  refreshAccessToken,
  getMessagesByHistoryId,
  getMessageById,
} from '@services/google';

const saveEmail: SQSHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const promises = event.Records.map(async (record) => {
    const { emailAddress, historyId }: Notification = JSON.parse(record.body);

    const user = await getUser(emailAddress);
    const accessToken = await refreshAccessToken(user.refreshToken);

    const historyMessages = await getMessagesByHistoryId(
      accessToken,
      historyId,
    );

    const messagePromises = historyMessages.map(async (historyMessage) => {
      const message = await getMessageById(accessToken, historyMessage.id);
      await saveMessage({ ...message, userEmail: emailAddress });
      return message;
    });

    await Promise.all(messagePromises);
  });

  await Promise.all(promises);
};

export const main = middyfy(saveEmail);
