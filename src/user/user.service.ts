import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { compare, hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import { SessionType } from '@prisma/client'
import { isAfter } from 'date-fns'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    })
  }

  async changePassword(
    id: string,
    { oldPassword, password }: ChangePasswordDto
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    })

    if (!user || !(await compare(oldPassword, user.password))) {
      throw new BadRequestException('Wrong password')
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.APP_SALT_ROUND)
    )

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) 

    await this.prisma.session.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiredAt: resetTokenExpiry,
        type: SessionType.PASSWORD_RESET,
      },
    })
  }

  async resetPassword(token: string, password: string) {
    const resetSession = await this.prisma.session.findUnique({
      where: { token, isExpired: false },
    })

    if (!resetSession || resetSession.type !== SessionType.PASSWORD_RESET) {
      throw new NotFoundException('Invalid Session!')
    }

    if (isAfter(new Date(), resetSession.expiredAt)) {
      throw new NotFoundException('Expired Session!')
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.APP_SALT_ROUND)
    )

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetSession.userId },
        data: { password: hashedPassword },
      })

      await tx.session.update({
        where: { token },
        data: { isExpired: true },
      })
    })
  }

  async verifyEmail(verifyToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { token: verifyToken },
    })

    if (!session || session.isExpired) {
      throw new NotFoundException('Invalid or expired verification token')
    }

    await this.prisma.user.update({
      where: { id: session.userId },
      data: { isEmailVerified: true },
    })

    await this.prisma.session.update({
      where: { token: verifyToken },
      data: { isExpired: true },
    })
  }
}
