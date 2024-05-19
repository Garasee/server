import express, { Express } from 'express'
import dotenv from 'dotenv'
import { initExample } from './example'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import { authMiddleware } from './middlewares/authMiddleware'

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
