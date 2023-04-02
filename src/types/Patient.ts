import User from './User.js';

type Patient = {
  id: string;
  personalInfo: User;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string | null;
  insuranceNumber: string | null;
  allergies: string;
  reviewsCount: number;
  appointmentsCount: number;
  averageRateGiven: number;
  updatedAt: Date;
};

export default Patient;
