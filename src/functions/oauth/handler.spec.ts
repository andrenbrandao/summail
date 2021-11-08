import type { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { main as handler } from './handler';

process.env.OAUTH_CLIENT_ID = 'client-id';
process.env.OAUTH_CLIENT_SECRET = 'client-secret';
process.env.OAUTH_REDIRECT_URI = 'http://localhost:4000/dev/oauth-callback';
process.env.OAUTH_URI = 'https://accounts.google.com/o/oauth2/auth';

describe('when a get request is made', () => {
  it('should redirect to the oauth url with client_id and scope as query params', async () => {
    const event = {} as APIGatewayEvent;
    const context = {} as Context;
    const callback = null as Callback;

    const response = await handler(event, context, callback);

    expect(response).toMatchObject({
      statusCode: 302,
      headers: {
        Location:
          'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.modify&response_type=code&client_id=client-id&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fdev%2Foauth-callback',
      },
    });
  });
});
