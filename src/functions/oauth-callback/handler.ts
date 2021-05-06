import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getTokensFromCode, getEmailAddress } from '@services/google';

import { getConnection } from '@libs/mongodb';
import { saveUser } from '@services/database/mongodb/repositories/UserRepository';
import { logger } from '@shared/logger';

const oauthCallback: APIGatewayProxyHandlerV2 = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info(event);

  const { code } = event.queryStringParameters;

  const { accessToken, refreshToken } = await getTokensFromCode(code);
  const emailAddress = await getEmailAddress(accessToken);

  await getConnection();
  await saveUser({ email: emailAddress, refreshToken });

  return formatJSONResponse({
    message: 'Successfully authenticated with Google Account.',
    user: emailAddress,
  });
};

export const main = middyfy(oauthCallback);
