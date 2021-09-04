import { generateMessage } from '@shared/__mocks__';
import { createEmailDigest } from '.';

describe('Create Email Digest', () => {
  describe('When multiple e-mails are processed together', () => {
    it('should merge them in a single email', () => {
      // Arrange
      const firstMessage = generateMessage({ decodedEmail: 'Simple email.' });
      const secondMessage = generateMessage({
        decodedEmail: 'Complex email. Yes, very complex.',
      });

      // Act
      const result = createEmailDigest({
        messages: [firstMessage, secondMessage],
        userEmail: 'receiver@gmail.com',
      });

      // Assert
      expect(result).toMatch(/Simple email./);
      expect(result).toMatch(/Complex email./);
    });
  });
});
