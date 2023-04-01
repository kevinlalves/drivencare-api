import User from './User';

type Doctor = {
  personalInfo: User;
  licenseNumber: string;
  rating: number | null;
  reviewsCount: number;
};

export default Doctor;
