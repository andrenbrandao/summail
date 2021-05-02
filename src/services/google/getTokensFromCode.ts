import { google } from 'googleapis';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const getTokensFromCode = async (code: string): Promise<Tokens> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI,
  );

  const { tokens } = await oAuth2Client.getToken(code);
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
};

export default getTokensFromCode;
