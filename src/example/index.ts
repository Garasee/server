import { Router } from 'express'
import { getHelloWorld } from './example.controller'

const router = Router()

router.get('/', getHelloWorld)

export default router
