import express from 'express'
import authRoutes from './auth'
import userRoutes from './users'
import exampleRoutes from './example'
import { authMiddleware } from './commons/token.middleware'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/users', authMiddleware, userRoutes)
app.use('/example', exampleRoutes)

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
