import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'streamer' && session.user.role !== 'mod')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

  try {
    await writeFile(filepath, buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ message: 'Error saving file' }, { status: 500 })
  }
}

