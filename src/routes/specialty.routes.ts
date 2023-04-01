import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import specialtySchemas from '../schemas/specialty.schemas.js';
import specialtiesController from '../controllers/specialties.controller.js';

const specialtyRoutes = Router();

specialtyRoutes.get('/', specialtiesController.findAll);
specialtyRoutes.get('/:slug', validateSchemaMiddleware(specialtySchemas.findBySlug), specialtiesController.findBySlug);
specialtyRoutes.post('/', validateSchemaMiddleware(specialtySchemas.create), specialtiesController.create);

export default specialtyRoutes;
