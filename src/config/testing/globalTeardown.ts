import { stopServer } from './mongoTest';

export default async function globalTeardown(): Promise<void> {
  await stopServer();
}
