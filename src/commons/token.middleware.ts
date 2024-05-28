import { Request as ExpressRequest, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { decryptToken } from '../utils/cryptoUtils'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends ExpressRequest {
  user?: any
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      isSuccess: false,
      statusCode: 401,
      message: 'Unauthorized',
      content: null,
    })
  }

  try {
    const decryptedToken = decryptToken(token)

    const userIdFromToken = decryptedToken.userId

    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return res.status(401).json({
        isSuccess: false,
        statusCode: 401,
        message: 'Unauthorized: Session not found',
        content: null,
      })
    }

    const userIdFromSession = session.userId

    if (userIdFromToken !== userIdFromSession) {
      return res.status(401).json({
        isSuccess: false,
        statusCode: 401,
        message: 'Unauthorized: User ID mismatch',
        content: null,
      })
    }

    req.user = { id: userIdFromToken }

    next()
  } catch (error) {
    console.error('Error in authMiddleware:', error)
    return res.status(401).json({
      isSuccess: false,
      statusCode: 401,
      message: 'Unauthorized',
      content: null,
    })
  }
}
