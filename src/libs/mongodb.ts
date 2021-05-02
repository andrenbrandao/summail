import mongoose, { Connection } from 'mongoose';
import { logger } from '@shared/logger';

// See API docs: http://mongoosejs.com/docs/lambda.html
let cacheDB: Connection;

logger.info(`CachedDB: ${JSON.stringify(cacheDB)}`);

const getConnection = async (): Promise<Connection> => {
  if (cacheDB && cacheDB.readyState === 1) {
    logger.info('Reusing existing connection...');
    return cacheDB;
  }

  try {
    const mongo = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
    });

    cacheDB = mongo.connection;
    logger.info('Connected successfully to MongoDB!');

    return cacheDB;
  } catch (error) {
    logger.error('Could not connect to MongoDB...');
    throw error;
  }
};

export { getConnection };
