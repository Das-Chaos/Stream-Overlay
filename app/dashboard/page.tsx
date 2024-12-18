'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import OverlayEditor from '../components/OverlayEditor'
import ModManagement from '../components/ModManagement'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [overlayUrl, setOverlayUrl] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) {
      setOverlayUrl(`${window.location.origin}/overlay/${session.user.name}`)
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.name}!</p>
        <p className="mb-4">Your overlay URL: <code className="bg-gray-200 p-1 rounded">{overlayUrl}</code></p>
        {session.user.role === 'streamer' && (
          <>
            <OverlayEditor />
            <ModManagement />
          </>
        )}
        {session.user.role === 'mod' && (
          <p>You are a mod. You can access the streamer's overlay editor.</p>
        )}
      </main>
    </div>
  )
}

