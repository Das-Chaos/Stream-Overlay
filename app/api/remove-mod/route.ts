import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'streamer') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'user',
        modFor: { disconnect: true },
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error removing mod:', error)
    return NextResponse.json({ message: 'An error occurred while removing mod' }, { status: 500 })
  }
}

