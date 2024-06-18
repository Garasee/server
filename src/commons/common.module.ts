import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utilities/response.util'
import { CipherUtil } from './utilities/cipher.util'
import { HttpModule } from '@nestjs/axios'

@Global()
@Module({
  providers: [ResponseUtil, CipherUtil],
  exports: [ResponseUtil, CipherUtil],
})
export class CommonModule {}
