import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { EmailUtil } from '../commons/utilities/email.util'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, EmailUtil],
})
export class UserModule {}
