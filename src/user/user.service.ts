import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'

import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { randomBytes } from 'crypto'
import { SessionType } from '@prisma/client'
import { isAfter } from 'date-fns'
import { compare, hash } from 'bcrypt'
import { RequestOtpDto, OtpType } from './dto/request-otp.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { EmailUtil } from '../commons/utilities/email.util'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailUtil: EmailUtil
  ) {}

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

  // TODO: Send email via pub/sub
  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour expiry

    await this.prisma.session.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiredAt: resetTokenExpiry,
        type: SessionType.PASSWORD_RESET,
      },
    })
  }

  async requestOtp({ email, type }: RequestOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new NotFoundException('User not found!')
    }

    const otp = randomBytes(4).toString('hex') // Simple OTP generation
    const otpExpiry = new Date(Date.now() + 300000) // 5 minutes expiry

    await this.prisma.session.create({
      data: {
        token: otp,
        userId: user.id,
        expiredAt: otpExpiry,
        type:
          type === OtpType.PASSWORD_RESET
            ? SessionType.PASSWORD_RESET
            : SessionType.AUTHENTICATION,
      },
    })

    this.logger.log(`OTP generated for ${email}: ${otp}`)

    await this.emailUtil.sendMail(
      email,
      'Your OTP Code',
      `Your OTP code is ${otp}. It will expire in 5 minutes.`
    )
  }

  async verifyOtp(userId: string, { otp }: VerifyOtpDto) {
    this.logger.log(`Verifying OTP for user ${userId}: ${otp}`)

    const session = await this.prisma.session.findFirst({
      where: {
        userId,
        token: otp,
        isExpired: false,
      },
    })

    if (!session) {
      this.logger.error(`No session found for OTP ${otp} and user ${userId}`)
      throw new BadRequestException('Invalid or expired OTP')
    }

    if (isAfter(new Date(), session.expiredAt)) {
      this.logger.error(`OTP ${otp} for user ${userId} is expired`)
      throw new BadRequestException('Invalid or expired OTP')
    }

    // Invalidate the OTP session after successful verification
    await this.prisma.session.update({
      where: { id: session.id },
      data: { isExpired: true },
    })

    this.logger.log(`OTP verified for user ${userId}`)

    return true
  }
  // Method untuk verifikasi token email
  async verifyEmailToken(verifyToken: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        token: verifyToken,
        isExpired: false,
        type: SessionType.AUTHENTICATION,
      },
    })

    if (!session) {
      this.logger.error(`No session found for verify token ${verifyToken}`)
      throw new BadRequestException('Invalid or expired verify token')
    }

    // Invalidate the session after successful verification
    await this.prisma.session.update({
      where: { id: session.id },
      data: { isExpired: true },
    })

    this.logger.log(`Email verified for session ${session.id}`)

    return true
  }
  async resetPassword(token: string, password: string) {
    const resetSession = await this.prisma.session.findFirst({
      where: {
        token,
        isExpired: false,
        type: SessionType.PASSWORD_RESET,
      },
    })

    if (!resetSession) {
      this.logger.error(`No session found for reset token ${token}`)
      throw new BadRequestException('Invalid or expired reset token')
    }

    if (isAfter(new Date(), resetSession.expiredAt)) {
      this.logger.error(`Reset token ${token} is expired`)
      throw new BadRequestException('Invalid or expired reset token')
    }

    const hashedPassword = await hash(
      password,
      parseInt(process.env.APP_SALT_ROUND, 10)
    )

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetSession.userId },
        data: { password: hashedPassword },
      })

      await tx.session.update({
        where: { id: resetSession.id },
        data: { isExpired: true },
      })
    })

    this.logger.log(`Password reset successfully for token ${token}`)
  }
}
