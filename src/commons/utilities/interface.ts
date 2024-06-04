import { HttpStatus } from '@nestjs/common'

export interface ResponseInterface {
  message?: string
  code?: HttpStatus
  isSuccess?: boolean
  content?: any
}
