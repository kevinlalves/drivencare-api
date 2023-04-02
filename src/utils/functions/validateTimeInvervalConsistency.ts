import { parse } from 'date-fns';

const validateTimeIntervalConsistency = ({ startTime, endTime }: { [key: string]: string }) => {
  const parsedStartTime = parse(startTime, 'HH:mm', new Date());
  const parsedEndTime = parse(endTime, 'HH:mm', new Date());

  return parsedEndTime > parsedStartTime;
};

export default validateTimeIntervalConsistency;
