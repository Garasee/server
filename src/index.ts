import express, { Express } from 'express'
import dotenv from 'dotenv'
import authRoutes from './auth'
import userRoutes from './users'

import { authMiddleware } from './commons/token.middleware'

import { initExample } from './example'

dotenv.config()

const app: Express = express()
app.use(express.json())

const port = process.env.PORT || 3000

const createServer = async () => {
  initExample(app)
  app.use('/auth', authRoutes)
  app.use('/users', authMiddleware, userRoutes)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}

createServer()
