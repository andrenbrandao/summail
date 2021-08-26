interface ISendEmailDTO {
  userEmail: string;
  emailDigest: string;
}

const sendEmail = async ({
  userEmail,
  emailDigest,
}: ISendEmailDTO): Promise<void> => {
  console.log(userEmail, emailDigest);
};

export default sendEmail;
