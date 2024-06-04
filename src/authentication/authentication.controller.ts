import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { RegistrationDto } from './dto/registration.dto'
import { LoginDto } from './dto/login.dto'
import { IsPublic } from '../commons/decorators/isPublic.decorator'
import { ResponseUtil } from '../commons/utilities/response.util'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Post('registration')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() registrationDto: RegistrationDto) {
    const { password, confirmationPassword } = registrationDto
    if (password !== confirmationPassword) {
      throw new BadRequestException(
        'Password does not match confirmation password'
      )
    }

    await this.authenticationService.register(registrationDto)

    return this.responseUtil.response({
      message: 'User successfully registered',
      code: HttpStatus.CREATED,
    })
  }

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authenticationService.login(loginDto)

    return this.responseUtil.response({
      message: 'Login successful',
      code: HttpStatus.OK,
      content: {
        token,
      },
    })
  }
}
