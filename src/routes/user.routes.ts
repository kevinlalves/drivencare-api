import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import userSchemas from '../schemas/user.schemas.js';
import usersController from '../controllers/users.controller.js';

const userRoutes = Router();

userRoutes.post('/sign-in', validateSchemaMiddleware(userSchemas.signIn), usersController.signIn);

export default userRoutes;
