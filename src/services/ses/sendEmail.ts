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
  await client
    .sendEmail({
      FromEmailAddress: 'newsletter@andrebrandao.me',
      Destination: { ToAddresses: [userEmail] },
      Content: { Raw: { Data: emailDigest } },
    })
    .promise();
};

export default sendEmail;
