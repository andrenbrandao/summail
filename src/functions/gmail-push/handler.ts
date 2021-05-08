import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';
import { sendMessage } from '@services/sqs';

import schema from './schema';

interface Notification {
  emailAddress: string;
  historyId: string;
}

const gmailPush: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  logger.info(event);
  const { message } = event.body;
  const { data } = message;

  const notification = Buffer.from(data, 'base64').toString('ascii');
  const parsedNotification: Notification = JSON.parse(notification);

  logger.info(parsedNotification);

  await sendMessage({
    MessageBody: JSON.stringify(parsedNotification),
    QueueUrl: process.env.GMAIL_NOTIFICATION_QUEUE_URL,
    MessageGroupId: parsedNotification.emailAddress,
  });

  logger.info('Sucessfully saved to Queue.');

  return formatJSONResponse({
    ...parsedNotification,
  });
};

export const main = middyfy(gmailPush);
