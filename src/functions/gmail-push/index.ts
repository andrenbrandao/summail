import type { AWS } from '@serverless/typescript';
import schema from './schema';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'gmail-push',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};

export default handler;
