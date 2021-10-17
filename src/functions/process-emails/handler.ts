import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';
import { sendEmail } from '@services/ses';
import { createEmailDigest } from '@services/email-processor';
import { Message } from '@shared/interfaces';
import readFromS3Middleware from './read-from-s3-middleware/readFromS3Middleware';

const processEmails: SQSHandler = async (event) => {
  logger.info(event);

  const promises = event.Records.map(async (record) => {
    const { emailAddress, messages } = JSON.parse(record.body);

    const parsedMessages: Message[] = messages;

    logger.info('Creating email digest...');
    const emailDigest = createEmailDigest({
      messages: parsedMessages,
      userEmail: emailAddress,
    });

    logger.info(`Sending newsletter email to ${emailAddress}`);
    await sendEmail({
      userEmail: emailAddress,
      emailDigest,
    });
    logger.info('Email Successfully Sent!');
  });

  await Promise.all(promises);
};

export const main = middyfy(processEmails).use(readFromS3Middleware);
