import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'

import { AppController } from './app.controller'
import { AuthenticationModule } from './authentication/authentication.module'
import { PrismaModule } from './prisma/prisma.module'
import { CommonModule } from './commons/common.module'
import { UserModule } from './user/user.module'
import { CityModule } from './city/city.module'

import { HttpExceptionFilter } from './commons/filters/http-exception.filter'
import { AuthGuard } from './authentication/auth.guard'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.REDIS_TTL || '6000'),
          limit: parseInt(process.env.REDIS_LIMIT || '10'),
        },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    AuthenticationModule,
    UserModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
