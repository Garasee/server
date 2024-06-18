import { Module } from '@nestjs/common'
import { PredictionService } from './prediction.service'
import { PredictionController } from './prediction.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
