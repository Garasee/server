import { Request, Response } from 'express'
import authService from './auth.service'

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await authService.login(email, password)
    res.status(result.statusCode).json(result)
  } catch (error) {
    res
      .status(500)
      .json({
        isSuccess: false,
        statusCode: 500,
        message: 'Internal Server Error',
      })
  }
}

export default { login }
