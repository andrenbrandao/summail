/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'login',
        cors: {
          origin: '${env:WEB_URL}',
          allowCredentials: true,
        },
      },
    },
  ],
};

export default handler;
