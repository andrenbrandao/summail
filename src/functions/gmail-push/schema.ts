export default {
  type: 'object',
  properties: {
    message: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        message_id: { type: 'string' },
      },
    },
    subscription: { type: 'string' },
  },
  required: ['message', 'subscription'],
} as const;
