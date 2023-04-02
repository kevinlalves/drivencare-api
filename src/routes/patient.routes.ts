import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import patientSchemas from '../schemas/patient.schemas.js';
import patientsController from '../controllers/patients.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const patientRoutes = Router();

patientRoutes.get('/', validateSchemaMiddleware(patientSchemas.findAll), patientsController.findAll);
patientRoutes.post('/sign_up', validateSchemaMiddleware(patientSchemas.signUp), patientsController.signUp);
patientRoutes.get(
  '/appointments',
  validateSchemaMiddleware(patientSchemas.findAllAppointments),
  authMiddleware,
  patientsController.findAllAppointments
);
patientRoutes.post(
  '/appointments',
  validateSchemaMiddleware(patientSchemas.createAppointment),
  authMiddleware,
  patientsController.createAppointment
);

export default patientRoutes;
