import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import doctorSchemas from '../schemas/doctor.schemas.js';
import doctorsController from '../controllers/doctors.controller.js';

const doctorRoutes = Router();

doctorRoutes.post('/sign_up', validateSchemaMiddleware(doctorSchemas.signUp), doctorsController.singUp);

export default doctorRoutes;
