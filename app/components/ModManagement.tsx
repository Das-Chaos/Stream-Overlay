'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Mod {
  id: string
  username: string
}

interface User {
  id: string
  email: string | null
  username: string
  role: string
}

interface ModManagementProps {}

export default function ModManagement(props: ModManagementProps) {
  const { data: session } = useSession()
  const [mods, setMods] = useState<Mod[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchMods()
    fetchUsers()
  }, [])

  const fetchMods = async () => {
    try {
      const response = await fetch('/api/mods')
      if (!response.ok) {
        throw new Error('Failed to fetch mods')
      }
      const data = await response.json()
      setMods(data.mods)
    } catch (error) {
      console.error('Error fetching mods:', error)
      toast.error('Failed to fetch mods')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    }
  }

  const assignMod = async (userId: string) => {
    try {
      const response = await fetch('/api/assign-mod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign mod role')
      }

      await fetchMods()
      await fetchUsers()
      toast.success('Successfully assigned mod role')
    } catch (error) {
      console.error('Error assigning mod role:', error)
      toast.error('Failed to assign mod role')
    }
  }

  const removeMod = async (userId: string) => {
    try {
      const response = await fetch('/api/remove-mod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove mod role')
      }

      await fetchMods()
      await fetchUsers()
      toast.success('Successfully removed mod role')
    } catch (error) {
      console.error('Error removing mod role:', error)
      toast.error('Failed to remove mod role')
    }
  }

  if (!session || session.user.role !== 'streamer') {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Mod Management</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Current Mods</h3>
          <ul className="bg-white shadow-md rounded-lg p-4">
            {mods.map(mod => (
              <li key={mod.id} className="flex justify-between items-center mb-2">
                <span>{mod.username}</span>
                <button
                  onClick={() => removeMod(mod.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Assign New Mod</h3>
          <ul className="bg-white shadow-md rounded-lg p-4">
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center mb-2">
                <span>{user.username}</span>
                {user.role === 'mod' ? (
                  <button
                    onClick={() => removeMod(user.id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Remove Mod
                  </button>
                ) : (
                  <button
                    onClick={() => assignMod(user.id)}
                    className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Make Mod
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
