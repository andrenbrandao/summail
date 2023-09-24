import {
  createMongoDBInstance,
  connect,
  clearDatabase,
  disconnect,
} from './mongoTest';

export default async function globalSetup(): Promise<void> {
  await createMongoDBInstance();
  await connect();
  await clearDatabase();
  await disconnect();
}
