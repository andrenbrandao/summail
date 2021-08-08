process.env.CRYPTO_SECRET_KEY = 'secret-key';
process.env.OAUTH_CLIENT_ID = 'client-id';
process.env.OAUTH_CLIENT_SECRET = 'client-secret';
process.env.OAUTH_REDIRECT_URI = 'http://localhost:4000/dev/oauth-callback';
process.env.OAUTH_URI = 'https://accounts.google.com/o/oauth2/auth';
process.env.GMAIL_NOTIFICATION_QUEUE_URL =
  'https://sqs.us-east-1.amazonaws.com/queue';
process.env.GOOGLE_PUBSUB_TOPIC_NAME =
  'projects/weekly-newsletter-email/topics/gmail-inbox-push-dev';
process.env.MESSAGE_PROCESSING_QUEUE_URL =
  'https://sqs.us-east-1.amazonaws.com/message-processing-queue';
