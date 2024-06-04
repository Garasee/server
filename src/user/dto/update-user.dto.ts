import { IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string

  @IsNotEmpty()
  @IsUUID(4)
  cityId: string
}
