/* eslint-disable import/no-extraneous-dependencies */
import { Message as IMessage } from '@shared/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { messageMock } from './messageMock';

interface GenerateMessageDTO extends Partial<IMessage> {
  decodedEmail?: string;
}

const generateMessage = (message: GenerateMessageDTO): IMessage => {
  const raw = message.decodedEmail
    ? Buffer.from(message.decodedEmail).toString('base64')
    : messageMock.raw;

  return {
    ...messageMock,
    ...message,
    raw,
    externalId: uuidv4(),
  };
};

export default generateMessage;
