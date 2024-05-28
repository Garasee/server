import { PrismaClient } from '@prisma/client'
import {
  hashPassword,
  comparePassword,
  encryptToken,
} from '../utils/cryptoUtils'
import { RegistrationBodyInterface } from './interface' // Import interface

const prisma = new PrismaClient()

const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Incorrect email or password',
      }
    }

    const match = await comparePassword(password, user.password)
    if (!match) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Incorrect email or password',
      }
    }

    const token = encryptToken({ userId: user.id })

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    return {
      isSuccess: true,
      statusCode: 200,
      message: 'Login successful',
      content: { token },
    }
  } catch (error) {
    console.error('Error during login:', error)
    throw new Error('Login failed')
  }
}

const registration = async ({
  name,
  email,
  phone,
  password,
  province,
  city,
}: RegistrationBodyInterface) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        isSuccess: false,
        statusCode: 409,
        message: 'Email already in use',
      }
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        province,
        city,
      },
    })

    return {
      isSuccess: true,
      statusCode: 201,
      message: 'User registered successfully',
      content: null,
    }
  } catch (error) {
    console.error('Error during registration:', error)
    throw new Error('Registration failed')
  }
}

export default { login, registration }
