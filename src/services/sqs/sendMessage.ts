import { SQS } from 'aws-sdk';

const sendMessage = async ({
  ...args
}: SQS.SendMessageRequest): Promise<void> => {
  const sqs = new SQS({ apiVersion: '2012-11-05' });
  await sqs.sendMessage(args).promise();
};

export default sendMessage;
