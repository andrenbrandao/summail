import { Message } from '@shared/interfaces';

import { generateBoundaryId } from './generateBoundaryId';
import { generateHeader } from './generateHeader';

interface createEmailDigestDTO {
  messages: Message[];
  userEmail: string;
}

const createEmailDigest = ({
  messages,
  userEmail,
}: createEmailDigestDTO): string => {
  const boundaryId = generateBoundaryId();
  const header = generateHeader({
    boundaryId,
    userEmail,
    subject: 'Last Week Newsletters',
  });

  const decodedEmails = messages.map((message) => {
    const decodedEmail = Buffer.from(message.raw, 'base64').toString();
    return decodedEmail;
  });

  const body = decodedEmails
    .map((message) => {
      return `--${boundaryId}\n${message}\n\n`;
    })
    .join('');

  const footer = `--${boundaryId}--`;

  return `${header}\n\n${body}\n${footer}`;
};

export default createEmailDigest;
