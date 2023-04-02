import User from './User.js';

type Doctor = {
  id: string;
  personalInfo: User;
  licenseNumber: string;
  rating: number | null;
  reviewsCount: number;
  appointmentsCount: number;
  specialties: Array<string>;
};

export default Doctor;
