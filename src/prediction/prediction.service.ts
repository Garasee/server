import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CompleteUserInterface } from '../authentication/auth.interface'
import { PredictionDto } from './dto/predict.dto'
import { HttpService } from '@nestjs/axios'
import * as process from 'process'
import { INJECTION_TYPE } from './constants/predict.constant'
import { PredictResult } from './interfaces/predict-result'

@Injectable()
export class PredictionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async predict(user: CompleteUserInterface, payload: PredictionDto) {
    const { data } = await this.httpService.axiosRef.post<PredictResult>(
      `${process.env.MODEL_API_URL}/predict`,
      payload
    )

    await this.prisma.prediction.create({
      data: {
        ...payload,
        ...data,
        injection: INJECTION_TYPE[payload.injection],
        userId: user.id,
      },
    })

    return data
  }

  async getPredictionHistory(user: CompleteUserInterface) {
    return this.prisma.prediction.findMany({
      where: {
        userId: user.id,
      },
      select: {
        brand: true,
        price: true,
        isAcceptable: true,
        createdAt: true,
      },
    })
  }
}
