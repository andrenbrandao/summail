import { generateMessage } from '@shared/__mocks__';
import { hasSuffixNewsletter } from './hasSuffixNewsletter';

const messageWithSuffix = generateMessage({
  userEmail: 'john@gmail.com',
  to: 'john+newsletter@gmail.com',
});

const messageWithoutSuffix = generateMessage({
  userEmail: 'john@gmail.com',
  to: 'john@gmail.com',
});

it('should return true if a message has a +newsletter suffix', () => {
  const isNewsletter = hasSuffixNewsletter('john@gmail.com', messageWithSuffix);
  expect(isNewsletter).toBe(true);
});

it('should return false if a message does not have a +newsletter suffix', () => {
  const isNewsletter = hasSuffixNewsletter(
    'john@gmail.com',
    messageWithoutSuffix,
  );
  expect(isNewsletter).toBe(false);
});
