import { Controller, Get } from '@nestjs/common'
import { CityService } from './city.service'
import { ResponseUtil } from '../commons/utilities/response.util'

@Controller('common/city')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Get()
  async getCities() {
    const cities = await this.cityService.getCities()
    return this.responseUtil.response({
      message: 'Cities retrieved successfully',
      content: { cities },
    })
  }
}
