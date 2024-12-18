import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const streamers = await prisma.user.findMany({
      where: { role: 'streamer' },
      select: {
        id: true,
        username: true,
      },
    })

    return NextResponse.json({ streamers })
  } catch (error) {
    console.error('Error fetching streamers:', error)
    return NextResponse.json({ message: 'An error occurred while fetching streamers' }, { status: 500 })
  }
}

