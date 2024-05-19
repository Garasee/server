import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/cryptoUtils'

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
