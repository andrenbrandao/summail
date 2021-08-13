import 'source-map-support/register';

import type { ScheduledHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';
import { sendMessage } from '@services/sqs';
import { getUsers } from '@services/database/mongodb/repositories/UserRepository';
import { getUserLastWeekMessages } from '@services/database/mongodb/repositories/MessageRepository';
import { getConnection } from '@libs/mongodb';

const readLastWeeksEmails: ScheduledHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  await getConnection();

  const users = await getUsers();

  const promises = users.map(async (user) => {
    const userMessages = await getUserLastWeekMessages(user.email);

    if (userMessages.length > 0) {
      logger.info('Sending messages to be processed...', {
        email: user.email,
      });
      await sendMessage({
        MessageBody: JSON.stringify({
          messages: userMessages,
          emailAddress: user.email,
        }),
        QueueUrl: process.env.MESSAGE_PROCESSING_QUEUE_URL,
      });
    }
  });

  await Promise.all(promises);
};

export const main = middyfy(readLastWeeksEmails);
