import { logger } from '@shared/logger';
import { SESV2 } from 'aws-sdk';

interface ISendEmailDTO {
  userEmail: string;
  emailDigest: string;
}

const sendEmail = async ({
  userEmail,
  emailDigest,
}: ISendEmailDTO): Promise<void> => {
  const client = new SESV2({ region: 'us-east-1' });

  logger.info({ emailDigest });
  const responseRaw = await client
    .sendEmail({
      FromEmailAddress: 'newsletter@andrebrandao.me',
      Destination: { ToAddresses: [userEmail] },
      Content: { Raw: { Data: emailDigest } },
    })
    .promise();

  logger.info(responseRaw);
};

export default sendEmail;
