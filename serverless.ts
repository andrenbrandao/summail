/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import { hello, oauth, oauthCallback } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'weekly-newsletter-email',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    stages: ['dev', 'qa', 'prod'],
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-stage-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      OAUTH_CLIENT_ID: '${env:OAUTH_CLIENT_ID}',
      OAUTH_CLIENT_SECRET: '${env:OAUTH_CLIENT_SECRET}',
      OAUTH_REDIRECT_URI: '${env:OAUTH_REDIRECT_URI}',
      OAUTH_URI: '${env:OAUTH_URI}',
      OAUTH_TOKEN_URI: '${env:OAUTH_TOKEN_URI}',
      OAUTH_PROVIDER_X509_CERT_URL: '${env:OAUTH_PROVIDER_X509_CERT_URL}',
      MONGODB_URI: '${env:MONGODB_URI}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, oauth, oauthCallback },
};

module.exports = serverlessConfiguration;
