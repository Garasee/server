import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  BadRequestException,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './user.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CompleteUserInterface } from '../authentication/auth.interface'
import { GetCurrentUser } from '../commons/decorators/getCurrentUser.dto'
import { ResponseUtil } from '../commons/utilities/response.util'
import { IsPublic } from '../commons/decorators/isPublic.decorator'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Get()
  async getUser(@GetCurrentUser() user: CompleteUserInterface) {
    return this.responseUtil.response({
      message: 'Data retrieved successfully',
      content: {
        user,
      },
    })
  }
  @Put()
  async updateUser(
    @GetCurrentUser() user: CompleteUserInterface,
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.userService.update(user.id, updateUserDto)
    return this.responseUtil.response({
      message: 'User updated successfully',
    })
  }

  @Patch('change-password')
  async changePassword(
    @GetCurrentUser() user: CompleteUserInterface,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const { password, confirmationPassword } = changePasswordDto
    if (password !== confirmationPassword) {
      throw new BadRequestException(
        'Password does not match confirmation password'
      )
    }

    await this.userService.changePassword(user.id, changePasswordDto)

    return this.responseUtil.response({
      message: 'Password changed',
    })
  }

  @IsPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.userService.forgotPassword(forgotPasswordDto)
    return this.responseUtil.response({
      message: 'An email to reset the password has been sent!',
    })
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Body() { password, confirmationPassword }: ResetPasswordDto
  ) {
    const token = req.headers['x-reset-token'] as string
    if (!token) {
      throw new BadRequestException('Invalid or missing reset token')
    }

    if (password !== confirmationPassword) {
      throw new BadRequestException(
        'Password does not match confirmation password'
      )
    }

    await this.userService.resetPassword(token, password)
    return this.responseUtil.response({
      message: 'Password successfully reset!',
    })
  }
}
