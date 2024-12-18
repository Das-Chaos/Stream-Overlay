import { NextApiRequest, NextApiResponse } from 'next'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '../../app/api/overlay-items/route'

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve({ user: { id: '123', role: 'streamer' } })),
}))

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    overlayItem: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: '456', type: 'text', content: 'New Text' }),
    },
  })),
}))

describe('/api/overlay-items', () => {
  it('GET returns overlay items', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    })

    await GET(req as any, res as any)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({ items: [] })
  })

  it('POST creates a new overlay item', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        type: 'text',
        content: 'New Text',
        position: { x: 0, y: 0 },
      },
    })

    await POST(req as any, res as any)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      item: { id: '456', type: 'text', content: 'New Text' },
      items: [],
    })
  })
})

