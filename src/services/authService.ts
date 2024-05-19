import bcrypt from 'bcrypt'
import { encryptToken } from '../utils/aesUtils'

const login = async (email: string, password: string) => {
  try {
    // Mocked user data. Replace this with actual database query.
    const user = {
      id: 1,
      email: 'example@example.com',
      hashedPassword:
        '$2b$10$0vL1ZkHvh.Ktw9tKnh/Jh.aS8b3DSTt7HZT1dMe.4a4kfw.vpn7tG', // Hashed password
    }

    // Compare hashed password with input password
    const match = await bcrypt.compare(password, user.hashedPassword)
    if (!match) {
      return {
        isSuccess: false,
        statusCode: 401,
        message: 'Incorrect email or password',
      }
    }

    // Generate and encrypt token
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
