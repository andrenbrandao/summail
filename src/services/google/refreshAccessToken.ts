import { google } from 'googleapis';

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
  );

  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  const { token } = await oAuth2Client.getAccessToken();
  return token;
};

export default refreshAccessToken;
