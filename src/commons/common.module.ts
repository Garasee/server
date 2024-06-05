import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utilities/response.util'
import { CipherUtil } from './utilities/cipher.util'
import { HttpModule } from '@nestjs/axios'
import { CityService } from '../services/city.service'
import { CityController } from './controllers/city.controller'

@Global()
@Module({
  providers: [ResponseUtil, CipherUtil, CityService],
  exports: [ResponseUtil, CipherUtil, CityService],
  imports: [HttpModule],
  controllers: [CityController],
})
export class CommonModule {}
