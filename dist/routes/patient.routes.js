import { Router } from 'express';
const patientRoutes = Router();
patientRoutes.post('/signup');
patientRoutes.post('/signin');
export default patientRoutes;
