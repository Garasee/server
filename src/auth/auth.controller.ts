import { Request, Response } from 'express'
import authService from './auth.service'

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await authService.login(email, password)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

const registration = async (req: Request, res: Response) => {
  const { name, email, phone, password, confirmationPassword, province, city } =
    req.body
  try {
    const result = await authService.registration(
      name,
      email,
      phone,
      password,
      confirmationPassword,
      province,
      city
    )
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    const result = await authService.forgotPassword(email)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmationPassword } = req.body
  try {
    const result = await authService.resetPassword(
      token,
      password,
      confirmationPassword
    )
    res.status(result.statusCode).json(result)
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
}

export default { login, registration, forgotPassword, resetPassword }
