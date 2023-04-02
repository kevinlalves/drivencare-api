import AppointmentStatus from './AppointmentStatus.js';
import WeekDay from './WeekDay.js';

type Appointment = {
  id: string;
  doctorName: string | null;
  specialty: string;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  date: string;
  status: AppointmentStatus;
  rating: number | null;
  review: string | null;
  createdAt: Date;
  finishedAt: Date;
};

export default Appointment;
