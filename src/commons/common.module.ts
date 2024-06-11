import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utilities/response.util'
import { CipherUtil } from './utilities/cipher.util'
import { EmailUtil } from './utilities/email.util'
import { HttpModule } from '@nestjs/axios'

@Global()
@Module({
  providers: [ResponseUtil, CipherUtil, EmailUtil],
  exports: [ResponseUtil, CipherUtil, EmailUtil],
  imports: [HttpModule],
})
export class CommonModule {}
