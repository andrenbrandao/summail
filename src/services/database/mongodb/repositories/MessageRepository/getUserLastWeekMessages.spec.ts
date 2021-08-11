/* eslint-disable no-underscore-dangle */
import { generateMessage } from '@shared/__mocks__';
import Message from '../../models/Message';
import getUserLastWeekMessages from './getUserLastWeekMessages';

jest.mock('@shared/utils/today', () => ({
  __esModule: true,
  default: () => new Date('2021-05-22T15:00:00Z'),
}));

const firstUserEmailSameDay = generateMessage({
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-22T15:00:00Z'),
});

const firstUserEmailOneWeekBefore = generateMessage({
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-15T16:00:00Z'),
});

const firstUserEmailLaterThanOneWeekBefore = generateMessage({
  userEmail: 'johndoe@gmail.com',
  to: 'johndoe+newsletter@gmail.com',
  receivedAt: new Date('2021-05-14T15:00:00Z'),
});

beforeEach(async () => {
  await Message.create(firstUserEmailSameDay);
  await Message.create(firstUserEmailOneWeekBefore);
  await Message.create(firstUserEmailLaterThanOneWeekBefore);
});

describe('getUserLastWeekMessages', () => {
  it("should return only the user's last week's messages", async () => {
    const messages = await getUserLastWeekMessages('johndoe@gmail.com');
    expect(messages[0].externalId).toEqual(
      firstUserEmailOneWeekBefore.externalId,
    );
    expect(messages[1].externalId).toEqual(firstUserEmailSameDay.externalId);
    expect(messages.length).toEqual(2);
  });
});
