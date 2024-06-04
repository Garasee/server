import { Injectable, Logger } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { ResponseInterface } from './interface'

@Injectable()
export class ResponseUtil {
  response({
    message = 'Data retrieved successfully',
    code = HttpStatus.OK,
    isSuccess = true,
    content,
  }: ResponseInterface) {
    const responsePayload = {
      message,
      code,
      isSuccess,
      content,
    }

    Logger.log(responsePayload, `Response Body`)

    return responsePayload
  }
}
