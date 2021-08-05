/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  timeout: 30,
  events: [
    {
      schedule: {
        name:
          '${self:service}-${opt:stage, self:provider.stage}-keepPubSubAlive',
        description:
          'Scheduled event to keep mailbox subscription alive in Gmail',
        rate: 'cron(0 8 * * ? *)',
      },
    },
  ],
};

export default handler;
