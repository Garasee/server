import { Request, Response } from 'express'
import { helloWorld } from './example.service'

export const getHelloWorld = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: helloWorld(),
  })
}
