import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

import schema from './schema';

const gmailPush: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  logger.info(event);
  const { message } = event.body;
  const { data } = message;

  const notification = Buffer.from(data, 'base64').toString('ascii');
  const parsedNotification = JSON.parse(notification);

  logger.info(parsedNotification);

  return formatJSONResponse({
    ...parsedNotification,
  });
};

export const main = middyfy(gmailPush);
