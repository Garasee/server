import { IsNotEmpty, IsString } from 'class-validator'

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string
}
