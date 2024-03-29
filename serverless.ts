/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import {
  oauth,
  oauthCallback,
  gmailPush,
  saveEmail,
  keepPubSubAlive,
  readLastWeeksEmails,
  processEmails,
  login,
} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'weekly-newsletter-email',
  frameworkVersion: '3',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    stages: ['local', 'dev', 'prod'],
    stage: '${opt:stage, self:provider.stage}',
    prune: {
      automatic: true,
      number: 3,
    },
    local: {
      GMAIL_NOTIFICATION_QUEUE_URL: 'http://localhost:3000',
      MESSAGE_PROCESSING_QUEUE_URL: 'http://localhost:3000',
      MESSAGE_PROCESSING_BUCKET_NAME: {
        Ref: 'MessageProcessingBucket',
      },
    },
    dev: {
      GMAIL_NOTIFICATION_QUEUE_URL: {
        'Fn::Join': [
          '',
          [
            'https://sqs.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/',
            { Ref: 'AWS::AccountId' },
            '/',
            { 'Fn::GetAtt': ['GmailNotificationQueue', 'QueueName'] },
          ],
        ],
      },
      MESSAGE_PROCESSING_QUEUE_URL: {
        'Fn::Join': [
          '',
          [
            'https://sqs.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/',
            { Ref: 'AWS::AccountId' },
            '/',
            { 'Fn::GetAtt': ['MessageProcessingQueue', 'QueueName'] },
          ],
        ],
      },
      MESSAGE_PROCESSING_BUCKET_NAME: {
        Ref: 'MessageProcessingBucket',
      },
    },
    prod: '${self:custom.dev}',
    customDomain: {
      domainName: '${self:custom.stage}-api.${env:DOMAIN}',
      basePath: '',
      endpointType: 'edge',
      certificateArn: '${env:CERTIFICATE_ARN}',
      createRoute53Record: true,
      stage: '${self:custom.stage}',
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-stage-manager',
    'serverless-prune-plugin',
    'serverless-domain-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      // gmailPush function
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage'],
        Resource: { 'Fn::GetAtt': ['GmailNotificationQueue', 'Arn'] },
      },
      // readLastWeekEmails function
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage'],
        Resource: { 'Fn::GetAtt': ['MessageProcessingQueue', 'Arn'] },
      },
      // processEmails function
      {
        Effect: 'Allow',
        Action: ['ses:SendEmail', 'ses:SendRawEmail'],
        Resource: '*',
      },
      // read from S3 Bucket: readLastWeekEmails and processEmails
      {
        Effect: 'Allow',
        Action: ['s3:PutObject', 's3:GetObject', 's3:ListBucket'],
        Resource: {
          'Fn::Join': [
            '',
            [{ 'Fn::GetAtt': ['MessageProcessingBucket', 'Arn'] }, '/*'],
          ],
        },
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      OAUTH_CLIENT_ID: '${env:OAUTH_CLIENT_ID}',
      OAUTH_CLIENT_SECRET: '${env:OAUTH_CLIENT_SECRET}',
      OAUTH_REDIRECT_URI: '${env:OAUTH_REDIRECT_URI}',
      OAUTH_URI: '${env:OAUTH_URI}',
      OAUTH_TOKEN_URI: '${env:OAUTH_TOKEN_URI}',
      OAUTH_PROVIDER_X509_CERT_URL: '${env:OAUTH_PROVIDER_X509_CERT_URL}',
      MONGODB_URI: '${env:MONGODB_URI}',
      CRYPTO_SECRET_KEY: '${env:CRYPTO_SECRET_KEY}',
      GMAIL_NOTIFICATION_QUEUE_URL:
        '${self:custom.${self:custom.stage}.GMAIL_NOTIFICATION_QUEUE_URL}',
      GOOGLE_PUBSUB_TOPIC_NAME: '${env:GOOGLE_PUBSUB_TOPIC_NAME}',
      MESSAGE_PROCESSING_QUEUE_URL:
        '${self:custom.${self:custom.stage}.MESSAGE_PROCESSING_QUEUE_URL}',
      MESSAGE_PROCESSING_BUCKET_NAME:
        '${self:custom.${self:custom.stage}.MESSAGE_PROCESSING_BUCKET_NAME}',
      EMAIL_SENDER_ADDRESS: '${env:EMAIL_SENDER_ADDRESS}',
      DOMAIN: '${env:DOMAIN}',
      JWT_SECRET: '${env:JWT_SECRET}',
      WEB_URL: '${env:WEB_URL}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    oauth,
    oauthCallback,
    gmailPush,
    saveEmail,
    keepPubSubAlive,
    readLastWeeksEmails,
    processEmails,
    login,
  },
  resources: {
    Resources: {
      GmailNotificationQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          FifoQueue: true,
          ContentBasedDeduplication: true,
          QueueName:
            '${self:service}-${self:custom.stage}_GmailNotificationQueue.fifo',
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['GmailNotificationQueueDLQ', 'Arn'],
            },
            maxReceiveCount: 3,
          },
        },
      },
      GmailNotificationQueueDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          FifoQueue: true,
          ContentBasedDeduplication: true,
          QueueName:
            '${self:service}-${self:custom.stage}_GmailNotificationQueueDLQ.fifo',
        },
      },
      GmailNotificationQueuePolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'allow-lambda-messages',
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::GetAtt': ['GmailNotificationQueue', 'Arn'],
                },
                Action: 'SQS:SendMessage',
                Condition: {
                  ArnEquals: {
                    'aws:SourceArn': {
                      'Fn::GetAtt': ['GmailPushLambdaFunction', 'Arn'],
                    },
                  },
                },
              },
            ],
          },
          Queues: [
            {
              Ref: 'GmailNotificationQueue',
            },
          ],
        },
      },
      MessageProcessingQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:custom.stage}_MessageProcessingQueue',
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['MessageProcessingQueueDLQ', 'Arn'],
            },
            maxReceiveCount: 3,
          },
        },
      },
      MessageProcessingQueueDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName:
            '${self:service}-${self:custom.stage}_MessageProcessingQueueDLQ',
        },
      },
      MessageProcessingQueuePolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'allow-lambda-messages',
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::GetAtt': ['MessageProcessingQueue', 'Arn'],
                },
                Action: 'SQS:SendMessage',
                Condition: {
                  ArnEquals: {
                    'aws:SourceArn': {
                      'Fn::GetAtt': [
                        'ReadLastWeeksEmailsLambdaFunction',
                        'Arn',
                      ],
                    },
                  },
                },
              },
            ],
          },
          Queues: [
            {
              Ref: 'MessageProcessingQueue',
            },
          ],
        },
      },
      MessageProcessingBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Retain',
        Properties: {
          BucketName: '${self:service}-${self:custom.stage}-message-processing',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
