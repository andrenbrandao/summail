import type { AWS } from '@serverless/typescript';

const handler: AWS['functions']['handler'] = {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'oauth',
      },
    },
  ],
};

export default handler;
