import type { AWS } from '@serverless/typescript';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': ['GmailNotificationQueue', 'Arn'],
        },
      },
    },
  ],
};

export default handler;
