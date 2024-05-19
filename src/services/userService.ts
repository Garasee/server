import { User } from '../models/userModel'
import { hashPassword, comparePassword } from '../utils/bcryptUtils'

const users: User[] = []

export const getUser = async (userId: string) => {
  const user = users.find((user) => user.id === userId)
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
}

export const updateUser = async (
  userId: string,
  name: string,
  phone: string,
  province: string,
  city: string
) => {
  const user = users.find((user) => user.id === userId)
  if (!user) {
    return {
      isSuccess: false,
      statusCode: 404,
      message: 'User not found',
      content: null,
    }
  }
  user.name = name
  user.phone = phone
  user.province = province
  user.city = city
  return {
    isSuccess: true,
    statusCode: 200,
    message: 'User updated',
    content: null,
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
  const user = users.find((user) => user.id === userId)
  if (!user || !(await comparePassword(oldPassword, user.password))) {
    return {
      isSuccess: false,
      statusCode: 401,
      message: 'Old password is incorrect',
      content: null,
    }
  }
  user.password = await hashPassword(password)
  return {
    isSuccess: true,
    statusCode: 200,
    message: 'Password changed',
    content: null,
  }
}
