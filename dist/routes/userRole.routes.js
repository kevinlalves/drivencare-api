import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import userRoleSchemas from '../schemas/userRole.schemas.js';
import userRolesController from '../controllers/userRoles.controller.js';
const userRoleRoutes = Router();
userRoleRoutes.get('/', userRolesController.findAll);
userRoleRoutes.get('/:slug', validateSchemaMiddleware(userRoleSchemas.findBySlug), userRolesController.findBySlug);
userRoleRoutes.post('/', validateSchemaMiddleware(userRoleSchemas.create), userRolesController.create);
export default userRoleRoutes;
