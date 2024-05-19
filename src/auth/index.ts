import { Express } from 'express';
import authController from './auth.controller';

export const initAuthRoutes = (app: Express) => {
  app.post('/auth/login', authController.login);
};
