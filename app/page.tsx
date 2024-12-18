import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/auth.config"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Stream Overlay Editor</h1>
        {session ? (
          <p>Welcome, {session.user.name}! <Link href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</Link></p>
        ) : (
          <div>
            <p className="mb-4">Please sign in or register to access the overlay editor.</p>
            <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600">Login</Link>
            <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Register</Link>
          </div>
        )}
      </main>
    </div>
  )
}
