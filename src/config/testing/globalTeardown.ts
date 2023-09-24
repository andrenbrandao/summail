import { disconnect } from './mongoTest';

export default async function globalTeardown(): Promise<void> {
  await disconnect();
}
