'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [streamers, setStreamers] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user?.role !== 'admin')) {
      router.push('/login')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers()
      fetchStreamers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchStreamers = async () => {
    try {
      const response = await fetch('/api/admin/streamers')
      if (response.ok) {
        const data = await response.json()
        setStreamers(data.streamers)
      }
    } catch (error) {
      console.error('Error fetching streamers:', error)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (response.ok) {
        fetchUsers()
        fetchStreamers()
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const assignModRole = async (userId, streamerId) => {
    try {
      const response = await fetch('/api/admin/assign-mod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, streamerId }),
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error assigning mod role:', error)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  >
                    <option value="user">User</option>
                    <option value="streamer">Streamer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {user.role === 'user' && (
                    <select
                      onChange={(e) => assignModRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Assign as Mod</option>
                      {streamers.map(streamer => (
                        <option key={streamer.id} value={streamer.id}>
                          {streamer.username}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
