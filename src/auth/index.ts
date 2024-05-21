import { Express } from 'express'
import authController from './auth.controller'

export const initAuthRoutes = (app: Express) => {
  app.post('/auth/login', authController.login)
  app.post('/auth/registration', authController.registration)
  app.post('/auth/forgot-password', authController.forgotPassword)
  app.patch('/auth/reset-password', authController.resetPassword)
}
