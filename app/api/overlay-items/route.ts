import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/auth.config"
import { z } from 'zod'
import rateLimitMiddleware from '../../../middleware/rateLimit'

const prisma = new PrismaClient()

const itemSchema = z.object({
  type: z.enum(['text', 'image', 'gif', 'sound']),
  content: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  style: z.object({
    fontSize: z.number().optional(),
    color: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
})

export async function GET(req: Request) {
  const rateLimitResult = await rateLimitMiddleware(req)
  if (rateLimitResult) return rateLimitResult
  
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'streamer' && session.user.role !== 'mod')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await prisma.overlayItem.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching overlay items:', error)
    return NextResponse.json({ message: 'An error occurred while fetching overlay items' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const rateLimitResult = await rateLimitMiddleware(req)
  if (rateLimitResult) return rateLimitResult
  
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'streamer' && session.user.role !== 'mod')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedItem = itemSchema.parse(body)

    const item = await prisma.overlayItem.create({
      data: {
        ...validatedItem,
        userId: session.user.id,
      },
    })

    const items = await prisma.overlayItem.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ item, items })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 })
    }
    console.error('Error creating overlay item:', error)
    return NextResponse.json({ message: 'An error occurred while creating the overlay item' }, { status: 500 })
  }
}
