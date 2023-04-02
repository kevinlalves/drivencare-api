import { Router } from 'express';
import validateSchemaMiddleware from '../middlewares/validateSchema.middleware.js';
import userSchemas from '../schemas/user.schemas.js';
import usersController from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const userRoutes = Router();

userRoutes.post('/sign_in', validateSchemaMiddleware(userSchemas.signIn), usersController.signIn);
userRoutes.get('/me', authMiddleware, usersController.findCurrent);

export default userRoutes;
