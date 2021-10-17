import { SQS, S3 } from 'aws-sdk';
import SqsExtendedClient from 'sqs-extended-client';

const sqs = new SQS({ apiVersion: '2012-11-05' });
const s3 = new S3();
const sqsExtendedClient = new SqsExtendedClient(sqs, s3, {
  bucketName: process.env.MESSAGE_PROCESSING_BUCKET_NAME,
});

export default sqsExtendedClient.middleware();
