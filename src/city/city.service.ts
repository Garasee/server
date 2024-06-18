import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async getCities() {
    return this.prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  }
}
