import { Controller, Get, HttpStatus } from '@nestjs/common'
import { CityService } from './city.service'
import { ResponseUtil } from '../commons/utilities/response.util'
import { IsPublic } from '../commons/decorators/isPublic.decorator'

@Controller('common')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Get('city')
  @IsPublic()
  async getCities() {
    const cities = await this.cityService.getCities()
    return this.responseUtil.response({
      message: 'Cities retrieved successfully',
      code: HttpStatus.OK,
      content: {
        cities,
      },
    })
  }
}
