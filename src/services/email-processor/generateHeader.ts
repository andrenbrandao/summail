interface generateHeaderDTO {
  boundaryId: string;
  userEmail: string;
  subject: string;
}

export const generateHeader = ({
  boundaryId,
  userEmail,
  subject,
}: generateHeaderDTO): string => {
  const header =
    `Subject: ${subject}\n` +
    `To: ${userEmail}\n` +
    `MIME-Version: 1.0\n` +
    `Content-Type: multipart/digest; boundary="${boundaryId}"`;

  return header;
};
