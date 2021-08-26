import 'source-map-support/register';

import type { SQSHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { logger } from '@shared/logger';

const processEmails: SQSHandler = async (event) => {
  logger.info(event);
};

export const main = middyfy(processEmails);
