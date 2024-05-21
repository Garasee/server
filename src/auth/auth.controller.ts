import { Request, Response } from 'express';
import authService from './auth.service';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const registration = async (req: Request, res: Response) => {
  const { name, email, phone, password, confirmationPassword, province, city } = req.body;
  if (password !== confirmationPassword) {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
    });
  }
  try {
    const result = await authService.registration(name, email, phone, password, province, city);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await authService.forgotPassword(email);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { password, confirmationPassword } = req.body;
  const token = req.headers['x-reset-token'];
  if (typeof token !== 'string') {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Invalid or missing reset token',
    });
  }
  if (password !== confirmationPassword) {
    return res.status(400).json({
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
    });
  }
  try {
    const result = await authService.resetPassword(token, password);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

export default { login, registration, forgotPassword, resetPassword };
