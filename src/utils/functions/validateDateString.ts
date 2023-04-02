import { isValid, parse } from 'date-fns';

const validateDateString = (dateString: string): Boolean => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(date);
};

export default validateDateString;
