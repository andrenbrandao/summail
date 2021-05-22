describe('when historyId is valid', () => {
  it.todo('should save emails to the database');
});

describe('when historyId is invalid', () => {
  it.todo('should throw a invalid historyId error');
});

describe('when the database fails to save', () => {
  it.todo('should throw a save failed error');
});

describe('when a failure occurs', () => {
  it.todo(
    'should only discard the failed messages to the SQS Dead Letter Queue',
  );
});
