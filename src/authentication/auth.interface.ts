import { City, User } from '@prisma/client'
import { Request } from 'express'

export interface CompleteUserInterface extends Partial<User> {
  city: Partial<City>
}

export interface AuthenticatedRequestInterface extends Request {
  user: CompleteUserInterface
}
