import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'

export enum OtpType {
  PASSWORD_RESET = 'PASSWORD_RESET',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export class RequestOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsEnum(OtpType)
  type: OtpType
}
