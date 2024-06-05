import { Module } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { CommonModule } from '../commons/common.module'

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
