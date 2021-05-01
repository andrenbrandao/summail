import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const oauth: APIGatewayProxyHandlerV2 = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI,
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  };
};

export const main = middyfy(oauth);
