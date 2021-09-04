import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';
import { sendEmail } from '@services/ses';
import { createEmailDigest } from '@services/email-processor';
import { Message } from '@shared/interfaces';

const processEmails: SQSHandler = async (event) => {
  logger.info(event);

  const promises = event.Records.map(async (record) => {
    const { emailAddress, messages } = JSON.parse(record.body);

    const parsedMessages: Message[] = JSON.parse(messages);
    const emailDigest = createEmailDigest({
      messages: parsedMessages,
      userEmail: emailAddress,
    });

    await sendEmail({
      userEmail: emailAddress,
      emailDigest,
    });
  });

  await Promise.all(promises);
};

export const main = middyfy(processEmails);
