import { Express } from 'express'
import { authMiddleware } from '../commons/token.middleware'
import {
  getUserController,
  updateUserController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
} from './user.controller'

export const initUserRoutes = (app: Express) => {
  app.get('/users', authMiddleware, getUserController)
  app.put('/users', authMiddleware, updateUserController)
  app.patch('/users/change-password', authMiddleware, changePasswordController)
  app.post('/users/forgot-password', forgotPasswordController)
  app.patch('/users/reset-password', resetPasswordController)
}
