import { Body, Controller, Get, Post } from '@nestjs/common'
import { PredictionService } from './prediction.service'
import { ResponseUtil } from '../commons/utilities/response.util'
import { GetCurrentUser } from '../commons/decorators/getCurrentUser.dto'
import { CompleteUserInterface } from '../authentication/auth.interface'
import { PredictionDto } from './dto/predict.dto'

@Controller('predictions')
export class PredictionController {
  constructor(
    private readonly predictionService: PredictionService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Post()
  async predict(
    @GetCurrentUser() user: CompleteUserInterface,
    @Body() predictionDto: PredictionDto
  ) {
    const result = await this.predictionService.predict(user, predictionDto)

    return this.responseUtil.response({
      message: 'Predicted successfully!',
      content: result,
    })
  }

  @Get()
  async getPredictionHistory(@GetCurrentUser() user: CompleteUserInterface) {
    return this.responseUtil.response({
      message: 'Predicted successfully!',
      content: await this.predictionService.getPredictionHistory(user),
    })
  }
}
