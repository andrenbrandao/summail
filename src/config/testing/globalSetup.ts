import { connect, clearDatabase } from './mongoTest';

export default async function globalSetup(): Promise<void> {
  await connect();
  await clearDatabase();
}
