import { Controller, Get } from '@nestjs/common'
import { ResponseUtil } from './commons/utilities/response.util'
import { IsPublic } from './commons/decorators/isPublic.decorator'

@Controller()
export class AppController {
  constructor(private responseUtil: ResponseUtil) {}

  @Get()
  @IsPublic()
  getHello() {
    return this.responseUtil.response({
      message: 'Hello World!',
    })
  }
}
