import { google } from 'googleapis';

const getEmailAddress = async (accessToken: string): Promise<string> => {
  const gmail = google.gmail({ version: 'v1' });
  const { data } = await gmail.users.getProfile({
    access_token: accessToken,
    userId: 'me',
  });
  return data.emailAddress;
};

export default getEmailAddress;
