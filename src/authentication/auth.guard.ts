import { PrismaService } from 'src/prisma/prisma.service'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthenticatedRequestInterface } from './auth.interface'
import { CipherUtil } from '../commons/utilities/cipher.util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly cipher: CipherUtil,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<AuthenticatedRequestInterface>()

    Logger.log(req.body, `Req ${req.method} ${req.url} ${req.ips}`)

    if (this.getPublicStatus(context)) return true

    if (!!req.headers.authorization) {
      const rawToken = req.headers.authorization.split(' ')[1]

      const token = await this.prisma.session.findUnique({
        where: {
          token: rawToken,
        },
      })

      if (!token) {
        throw new UnauthorizedException(`Invalid Token`)
      }

      let userId: string
      try {
        userId = this.cipher.decryptToken(rawToken)
      } catch (e) {
        throw new UnauthorizedException(`Invalid Token`)
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!req.headers.authorization) {
        req.body.token = rawToken
      }

      if (!!user) {
        req.user = user
        return true
      }
    }

    return false
  }

  private getPublicStatus(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
  }
}
