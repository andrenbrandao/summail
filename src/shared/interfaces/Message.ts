interface Message {
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