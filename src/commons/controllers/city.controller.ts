import { Controller, Get, HttpStatus } from '@nestjs/common'
import { CityService } from '../../services/city.service'
import { ResponseUtil } from '../utilities/response.util'
import { IsPublic } from '../decorators/isPublic.decorator'

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
