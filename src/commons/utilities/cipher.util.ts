import { genSaltSync } from 'bcrypt'
import { BadRequestException, Injectable } from '@nestjs/common'
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto'

@Injectable()
export class CipherUtil {
  SALT_ROUNDS = parseInt(process.env.ENCRYPTION_SALT_ROUNDS) || 10
  ALGORITHM = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc'
  KEY: Buffer

  constructor() {
    this.KEY = scryptSync(
      process.env.ENCRYPTION_KEY || 'default_key',
      genSaltSync(this.SALT_ROUNDS),
      32
    )
  }

  encryptToken(userId: string) {
    const iv = randomBytes(16)
    const cipher = createCipheriv(this.ALGORITHM, this.KEY, iv)
    let encrypted = cipher.update(userId, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const ivHex = iv.toString('hex')
    return `${ivHex}:${encrypted}`
  }

  decryptToken(token: string) {
    const [ivHex, encrypted] = token.split(':')
    if (!ivHex || !encrypted) {
      throw new BadRequestException('Invalid Token')
    }
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = createDecipheriv(this.ALGORITHM, this.KEY, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
