import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PredictionDto {
  @IsNotEmpty()
  @IsString()
  brand: string

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean

  @IsNotEmpty()
  @IsNumber()
  year: number

  @IsNotEmpty()
  @IsNumber()
  engineCapacity: number

  @IsNotEmpty()
  @IsNumber()
  peakPower: number

  @IsNotEmpty()
  @IsNumber()
  peakTorque: number

  @IsNotEmpty()
  @IsString()
  injection: 'Multi-Point Injection' | 'Direct Injection'

  @IsNotEmpty()
  @IsNumber()
  length: number

  @IsNotEmpty()
  @IsNumber()
  width: number

  @IsNotEmpty()
  @IsNumber()
  wheelBase: number

  @IsNotEmpty()
  @IsNumber()
  doorAmount: number

  @IsNotEmpty()
  @IsNumber()
  seatCapacity: number
}
