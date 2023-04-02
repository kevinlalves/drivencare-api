import Specialty from './Specialty.js';

type WeeklySchedule = {
  id: string;
  specialty: Specialty;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

export default WeeklySchedule;
