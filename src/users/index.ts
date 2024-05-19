import { Express } from 'express'
import { authMiddleware } from '../commons/token.middleware'
import {
  getUserController,
  updateUserController,
  changePasswordController,
} from './user.controller'

export const initUserRoutes = (app: Express) => {
  app.get('/users', authMiddleware, getUserController)
  app.put('/users', authMiddleware, updateUserController)
  app.patch('/users/change-password', authMiddleware, changePasswordController)
}
