import { PrismaClient } from '@prisma/client'
import { comparePassword, encryptToken } from '../utils/cryptoUtils'

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

export default { login }
