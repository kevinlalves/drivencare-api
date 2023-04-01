import { Router } from 'express';
import doctorRoutes from './doctor.routes.js';
import patientRoutes from './patient.routes.js';
import userRoutes from './user.routes.js';
import userRoleRoutes from './userRole.routes.js';
import specialtyRoutes from './specialty.routes.js';

const routes = Router();

routes.use('/doctors', doctorRoutes);
routes.use('/patients', patientRoutes);
routes.use('/users', userRoutes);
routes.use('/user_roles', userRoleRoutes);
routes.use('/specialties', specialtyRoutes);

export default routes;
