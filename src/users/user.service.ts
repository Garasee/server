import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/cryptoUtils'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return {
        isSuccess: false,
        statusCode: 404,
        message: 'User not found',
        content: null,
      }
    }
    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User retrieved',
      content: user,
    }
  } catch (error) {
    console.error('Error while getting user:', error)
    throw new Error('Failed to get user')
  }
}

export const updateUser = async (
  userId: string,
  name: string,
  phone: string,
  province: string,
  city: string
) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone, province, city },
    })
    return {
      isSuccess: true,
      statusCode: 200,
      message: 'User updated',
      content: null,
    }
  } catch (error) {
    console.error('Error while updating user:', error)
    throw new Error('Failed to update user')
  }
}

export const changePassword = async (
  userId: string,
  oldPassword: string,
  password: string,
  confirmationPassword: string
) => {
  if (password !== confirmationPassword) {
    return {
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
      content: null,
    }
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user || !(await comparePassword(oldPassword, user.password))) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Old password is incorrect',
        content: null,
      }
    }
    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Password changed',
      content: null,
    }
  } catch (error) {
    console.error('Error while changing password:', error)
    throw new Error('Failed to change password')
  }
}

export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        isSuccess: false,
        statusCode: 404,
        message: 'User not found',
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour expiry

    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiredAt: resetTokenExpiry,
      },
    })

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, use this token: ${resetToken}`,
    }

    await transporter.sendMail(mailOptions)

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Reset token sent to email',
    }
  } catch (error) {
    console.error('Error during forgotPassword:', error)
    throw new Error('Forgot password failed')
  }
}

export const resetPassword = async (
  token: string,
  password: string,
  confirmationPassword: string
) => {
  if (password !== confirmationPassword) {
    return {
      isSuccess: false,
      statusCode: 400,
      message: 'Passwords do not match',
      content: null,
    }
  }

  try {
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.expiredAt < new Date()) {
      return {
        isSuccess: false,
        statusCode: 400,
        message: 'Invalid or expired reset token',
        content: null,
      }
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordReset.delete({
      where: { token },
    })

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Password reset successful',
      content: null,
    }
  } catch (error) {
    console.error('Error during resetPassword:', error)
    throw new Error('Reset password failed')
  }
}
