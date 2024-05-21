import { PrismaClient, SessionType } from '@prisma/client';
import { hashPassword, comparePassword, encryptToken } from '../utils/cryptoUtils';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Incorrect email or password',
      };
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Incorrect email or password',
      };
    }

    const token = encryptToken({ userId: user.id });

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Login successful',
      content: { token },
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed');
  }
};

const registration = async (name: string, email: string, phone: string, password: string, province: string, city: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        isSuccess: false,
        statusCode: 409,
        message: 'Email already in use',
      };
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        province,
        city,
      },
    });

    return {
      isSuccess: true,
      statusCode: 201,
      message: 'User registered successfully',
      content: null,
    };
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed');
  }
};

const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        isSuccess: false,
        statusCode: 404,
        message: 'User not found',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await prisma.session.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiredAt: resetTokenExpiry,
        type: SessionType.PASSWORD_RESET,
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, use this token: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Reset token sent to email',
    };
  } catch (error) {
    console.error('Error during forgotPassword:', error);
    throw new Error('Forgot password failed');
  }
};

const resetPassword = async (token: string, password: string) => {
  try {
    const resetSession = await prisma.session.findUnique({
      where: { token },
    });

    if (!resetSession || resetSession.expiredAt < new Date() || resetSession.type !== SessionType.PASSWORD_RESET) {
      return {
        isSuccess: false,
        statusCode: 400,
        message: 'Invalid or expired reset token',
        content: null,
      };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: resetSession.userId },
      data: { password: hashedPassword },
    });

    await prisma.session.delete({
      where: { token },
    });

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Password reset successful',
      content: null,
    };
  } catch (error) {
    console.error('Error during resetPassword:', error);
    throw new Error('Reset password failed');
  }
};

export default { login, registration, forgotPassword, resetPassword };
