import { Message } from '@shared/interfaces';

import { generateBoundaryId } from './generateBoundaryId';
import { generateHeader } from './generateHeader';
import { generateSubject } from './generateSubject';

interface createEmailDigestDTO {
  messages: Message[];
  userEmail: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

const createEmailDigest = ({
  messages,
  userEmail,
  dateRange,
}: createEmailDigestDTO): string => {
  const boundaryId = generateBoundaryId();
  const header = generateHeader({
    boundaryId,
    userEmail,
    subject: generateSubject(dateRange),
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
