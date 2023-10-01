/* eslint-disable camelcase */
import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { google } from 'googleapis';
import { logger } from '@shared/logger';
import { getConnection } from '@libs/mongodb';
import { saveUser } from '@services/database/mongodb/repositories/UserRepository';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION_1H = 3600;

const login: APIGatewayProxyHandlerV2 = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  const params = new URLSearchParams(event.body);

  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
  );

  logger.info('Verifying Google OAuth token...');
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: params.get('credential'),
  });
  const payload = ticket.getPayload();

  await getConnection();
  await saveUser({ email: payload.email });

  logger.info('Creating JWT token...');
  const token = await jwt.sign(
    { email: payload.email },
    process.env.JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRATION_1H,
    },
  );

  const cookieHeaders = [
    `auth-token=${token}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${TOKEN_EXPIRATION_1H}`,
  ];
  if (!process.env.IS_OFFLINE) {
    cookieHeaders.push('Secure');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(token),
    headers: {
      'Access-Control-Expose-Headers': 'Set-Cookie',
      'Set-Cookie': cookieHeaders.join(';'),
    },
  };
};

export const main = middyfy(login);
