import { Module } from '@nestjs/common'
import { CityService } from './city.service'
import { CityController } from './city.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { CommonModule } from '../commons/common.module'

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
