import { generateSubject } from './generateSubject';

describe('generateSubject', () => {
  it('should generate a subject for a given period', () => {
    const text = generateSubject({
      from: new Date('2021-11-06'),
      to: new Date('2021-11-12'),
    });

    expect(text).toMatch(/6-12 November/);
  });

  it('should make it shorter if between months', () => {
    const text = generateSubject({
      from: new Date('2021-10-28'),
      to: new Date('2021-11-04'),
    });

    expect(text).toMatch(/28 Oct to 4 Nov/);
  });
});
