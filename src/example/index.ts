import { Express } from 'express'
import { getHelloWorld } from './example.controller'

export const initExample = (app: Express) => {
  app.get('/', getHelloWorld)
}
