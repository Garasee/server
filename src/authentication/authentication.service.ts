import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { RegistrationDto } from './dto/registration.dto'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from 'src/prisma/prisma.service'

import { compare, hash } from 'bcrypt'
import { CipherUtil } from '../commons/utilities/cipher.util'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipher: CipherUtil
  ) {}

  async register({
    email,
    password,
    confirmationPassword: _,
    ...registrationDto
  }: RegistrationDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User is already exists!')
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.APP_SALT_ROUND)
    )

    await this.prisma.user.create({
      data: {
        ...registrationDto,
        email,
        password: hashedPassword,
      },
    })
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException("User didn't exists")
    }

    const match = await compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException('Wrong email or password')
    }

    const token = this.cipher.encryptToken(user.id)

    await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    return token
  }
}
