import AppointmentStatus from './AppointmentStatus.js';
import Patient from './Patient.js';
import WeekDay from './WeekDay.js';

type Appointment = {
  id: string;
  doctorName: string | null;
  patientInfo: Patient | null;
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
