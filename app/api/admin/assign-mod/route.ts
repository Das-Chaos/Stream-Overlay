import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/auth.config"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId, streamerId } = await req.json()

    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    const streamerExists = await prisma.user.findUnique({ where: { id: streamerId } })

    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (!streamerExists) {
      return NextResponse.json({ message: 'Streamer not found' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'mod',
        modFor: { connect: { id: streamerId } },
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error assigning mod role:', error)
    return NextResponse.json({ message: 'An error occurred while assigning mod role' }, { status: 500 })
  }
}
