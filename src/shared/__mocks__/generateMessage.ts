/* eslint-disable import/no-extraneous-dependencies */
import { Message as IMessage } from '@shared/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { messageMock } from './messageMock';

const generateMessage = (message: Partial<IMessage>): IMessage => {
  return {
    ...messageMock,
    ...message,
    externalId: uuidv4(),
  };
};

export default generateMessage;
