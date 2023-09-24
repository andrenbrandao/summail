import { clearDatabase } from './mongoTest';

afterEach(async () => {
  await clearDatabase();
});
