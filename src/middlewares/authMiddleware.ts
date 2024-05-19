import { Request as ExpressRequest, Response, NextFunction } from 'express'
import { decryptToken, verifyToken } from '../utils/aesUtils'

interface AuthenticatedRequest extends ExpressRequest {
  user?: any
}

export const authMiddleware = (
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

    const user = verifyToken(decryptedToken)
    req.user = user
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
