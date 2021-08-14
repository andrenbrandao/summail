/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  timeout: 30,
  events: [
    {
      schedule: {
        name:
          '${self:service}-${opt:stage, self:provider.stage}-readLastWeeksEmails',
        description: 'Scheduled event to read last weeks emails.',
        rate: 'cron(0 1 * * ? *)',
      },
    },
  ],
};
export default handler;
