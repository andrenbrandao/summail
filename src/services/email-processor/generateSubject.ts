import { format, isSameMonth } from 'date-fns';

export const generateSubject = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): string => {
  let formattedDate: string;

  if (isSameMonth(from, to)) {
    formattedDate = `${format(from, 'd')}-${format(to, 'd MMMM')}`;
  } else {
    formattedDate = `${format(from, 'd MMM')} to ${format(to, 'd MMM')}`;
  }

  return `Weekly Newsletter - ${formattedDate}`;
};
