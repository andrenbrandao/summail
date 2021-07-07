/* eslint-disable camelcase */
import { gmail_v1 } from 'googleapis';

interface Message extends Omit<gmail_v1.Schema$Message, 'id'> {
  userEmail: string;
  from: string;
  to: string;
  externalId?: string;
  historyId?: string;
  labelIds?: string[];
  raw?: string;
  sizeEstimate?: number;
  snippet?: string;
  threadId?: string;
  receivedAt?: Date;
}

export default Message;
