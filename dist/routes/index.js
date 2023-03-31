import { Router } from 'express';
import doctorRoutes from './doctor.routes.js';
import patientRoutes from './patient.routes.js';
const routes = Router();
routes.use('/doctors', doctorRoutes);
routes.use('/patients', patientRoutes);
export default routes;
