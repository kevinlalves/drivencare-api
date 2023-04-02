import Specialty from './Specialty.js';
import WeekDay from './WeekDay.js';

type WeeklySchedule = {
  id: string;
  specialty: Specialty;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
};

export default WeeklySchedule;
