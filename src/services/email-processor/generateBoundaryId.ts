import { v4 as uuidv4 } from 'uuid';

export const generateBoundaryId = (): string => {
  const uuid = uuidv4();

  return uuid.replace(/-/g, '');
};
