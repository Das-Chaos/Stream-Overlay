import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/auth.config"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'streamer') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const mods = await prisma.user.findMany({
      where: {
        role: 'mod',
        modFor: { id: session.user.id },
      },
      select: {
        id: true,
        username: true,
      },
    })

    return NextResponse.json({ mods })
  } catch (error) {
    console.error('Error fetching mods:', error)
    return NextResponse.json({ message: 'An error occurred while fetching mods' }, { status: 500 })
  }
}
