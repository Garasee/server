import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const whitelist = process.env.APP_WHITELIST
  if (!whitelist) {
    throw new Error('APP_WHITELIST is not defined in the environment variables')
  }
  const whitelistUrls: any[] = whitelist.split(',')

  const corsOptions = {
    credentials: true,
    origin: whitelistUrls,
    methods: '*',
  }

  const app = await NestFactory.create(AppModule)
  app.enableCors(corsOptions)
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT || process.env.APP_PORT || 3001)
}
bootstrap()
