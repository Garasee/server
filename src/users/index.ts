import { Router } from 'express'
import {
  getUserController,
  updateUserController,
  changePasswordController,
} from './user.controller'

const router = Router()

router.get('/', getUserController)
router.put('/', updateUserController)
router.patch('/change-password', changePasswordController)

export default router
