import { Request, Response } from 'express'
import {
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from './user.service'

interface UserRequest extends Request {
  user?: {
    id: string
  }
}

export const getUserController = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found' })
  }
  const result = await getUser(userId)
  res.status(result.statusCode).json(result)
}

export const updateUserController = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found' })
  }
  const { name, phone, province, city } = req.body
  const result = await updateUser(userId, name, phone, province, city)
  res.status(result.statusCode).json(result)
}

export const changePasswordController = async (
  req: UserRequest,
  res: Response
) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User ID not found' })
  }
  const { oldPassword, password, confirmationPassword } = req.body
  const result = await changePassword(
    userId,
    oldPassword,
    password,
    confirmationPassword
  )
  res.status(result.statusCode).json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const result = await forgotPassword(email)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password, confirmationPassword } = req.body

  try {
    const result = await resetPassword(token, password, confirmationPassword)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
