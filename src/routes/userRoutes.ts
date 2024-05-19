import { Router } from 'express'
import {
  getUserController,
  updateUserController,
  changePasswordController,
} from '../controllers/userController'

const router = Router()

router.get('/', getUserController)
router.put('/', updateUserController)
router.patch('/change-password', changePasswordController)

export default router
