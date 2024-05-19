import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = process.env.SECRET_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
const ivLength = 16

export const encryptToken = (data: any): string => {
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, 'utf8'),
    iv
  )
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decryptToken = (token: string): any => {
  const [iv, encrypted] = token.split(':')
  const ivBuffer = Buffer.from(iv, 'hex')
  const encryptedBuffer = Buffer.from(encrypted, 'hex')
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, 'utf8'),
    ivBuffer
  )
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ])
  return JSON.parse(decrypted.toString())
}

export const verifyToken = (token: string): any => {
  try {
    return decryptToken(token)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
