import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'streamer') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'user',
        NOT: {
          modFor: { id: session.user.id },
        },
      },
      select: {
        id: true,
        username: true,
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'An error occurred while fetching users' }, { status: 500 })
  }
}

