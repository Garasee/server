import bcrypt from 'bcrypt'
import crypto from 'crypto'

const SALT_ROUNDS = 10
const ALGORITHM = 'aes-256-cbc'
const KEY = crypto.scryptSync(
  process.env.ENCRYPTION_KEY || 'default_key',
  'salt',
  32
)

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const encryptToken = (data: any): string => {
  const jsonData = JSON.stringify(data)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(jsonData, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const ivHex = iv.toString('hex')
  const token = `${ivHex}:${encrypted}`
  console.log('Generated token:', token)
  return token
}

export const decryptToken = (encryptedData: string): any => {
  try {
    const [ivHex, encrypted] = encryptedData.split(':')
    if (!ivHex || !encrypted) {
      console.error('Invalid token format:', encryptedData)
      throw new Error('Invalid token format')
    }
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Error decrypting token:', error)
    throw new Error('Invalid token')
  }
}
