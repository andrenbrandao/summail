import { google } from 'googleapis';
import { Message } from '@shared/interfaces';

type GetMessageByIdDTO = Omit<Message, 'userEmail'>;

const getMessageById = async (
  accessToken: string,
  messageId: string,
): Promise<GetMessageByIdDTO> => {
  const gmail = google.gmail({ version: 'v1' });

  const { data } = await gmail.users.messages.get({
    id: messageId,
    userId: 'me',
    format: 'raw',
    access_token: accessToken,
  });

  const { id, internalDate, ...otherProps } = data;

  return {
    ...otherProps,
    externalId: id,
    receivedAt: new Date(Number(internalDate)),
  };
};

export default getMessageById;
