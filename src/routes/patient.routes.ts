import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import patientSchemas from '../schemas/patient.schemas.js';
import patientsController from '../controllers/patients.controller.js';

const patientRoutes = Router();

patientRoutes.get('/', validateSchemaMiddleware(patientSchemas.findAll), patientsController.findAll);
patientRoutes.post('/sign_up', validateSchemaMiddleware(patientSchemas.signUp), patientsController.signUp);

export default patientRoutes;
