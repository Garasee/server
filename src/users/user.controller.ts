import { Request, Response } from 'express'
import {
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  changePassword,
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
  if (password !== confirmationPassword) {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
    })
  }
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
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { password, confirmationPassword } = req.body
  const token = req.headers['x-reset-token'] as string
  if (!token) {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Invalid or missing reset token',
    })
  }
  if (password !== confirmationPassword) {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
    })
  }
  try {
    const result = await resetPassword(token, password)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}
