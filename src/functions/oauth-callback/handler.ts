import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getTokensFromCode, getEmailAddress } from '@services/google';

const oauthCallback: APIGatewayProxyHandlerV2 = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;

  const { code } = event.queryStringParameters;

  const { accessToken } = await getTokensFromCode(code);
  const emailAddress = await getEmailAddress(accessToken);

  return formatJSONResponse({
    message: 'Successfully authenticated with Google Account.',
    user: emailAddress,
  });
};

export const main = middyfy(oauthCallback);
