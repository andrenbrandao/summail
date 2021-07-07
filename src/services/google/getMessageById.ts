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
    from: getSender(data.raw),
    to: getReceiver(data.raw),
    receivedAt: new Date(Number(internalDate)),
  };
};

function getSender(rawMessage: string) {
  const decodedMessage = Buffer.from(rawMessage, 'base64').toString();

  const re = /From:(?:.*<| )([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  return re.exec(decodedMessage)?.[1];
}

function getReceiver(rawMessage: string) {
  const decodedMessage = Buffer.from(rawMessage, 'base64').toString();

  const re = /To:(?:.*<| )([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  return re.exec(decodedMessage)?.[1];
}

export default getMessageById;
