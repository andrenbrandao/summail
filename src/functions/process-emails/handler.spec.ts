import type { Context, Callback } from 'aws-lambda';
import { generateMessage } from '@shared/__mocks__';
import { sendEmail } from '@services/ses';
import { main as handler } from './handler';

import mockEvent from './mock.json';

jest.mock('@services/ses');

const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe("Process User's Emails", () => {
  const createEvent = ({
    userEmail,
    messages,
  }: {
    userEmail: string;
    messages: string;
  }) => {
    const newEvent = {
      Records: [
        {
          ...mockEvent.Records[0],
          body: JSON.stringify({
            emailAddress: userEmail,
            messages,
          }),
        },
      ],
    };

    return newEvent;
  };

  // APPLY THESE ARTICLES:
  // https://khalilstemmler.com/articles/test-driven-development/use-case-tests-mocking/
  // https://khalilstemmler.com/articles/test-driven-development/how-to-mock-typescript/

  describe('Given the user has newsletter emails from last week', () => {
    describe('When it is the day for him to read them', () => {
      it('Then the emails should be digested and sent to the user', async () => {
        // Arrange
        const message = generateMessage({
          userEmail: 'johndoe@gmail.com',
          to: 'johndoe+newsletter@gmail.com',
        });
        const event = createEvent({
          userEmail: 'johndoe@gmail.com',
          messages: JSON.stringify([message]),
        });
        const context = {} as Context;
        const callback = null as Callback;

        // Act
        await handler(event, context, callback);

        // Assert
        expect(mockSendEmail).toHaveBeenCalledWith({
          userEmail: 'johndoe@gmail.com',
          emailDigest: expect.stringContaining('Simple email.'),
        });
      });
    });
  });
});
