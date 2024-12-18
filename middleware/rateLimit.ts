import { NextApiRequest, NextApiResponse } from 'next'

export default function rateLimitMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  return Promise.resolve()
}
