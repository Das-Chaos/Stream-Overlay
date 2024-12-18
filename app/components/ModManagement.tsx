'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function ModManagement() {
  const { data: session } = useSession()
  const [mods, setMods] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchMods()
    fetchUsers()
  }, [])

  const fetchMods = async () => {
    try {
      const response = await fetch('/api/mods')
      if (response.ok) {
        const data = await response.json()
        setMods(data.mods)
      }
    } catch (error) {
      console.error('Error fetching mods:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const assignMod = async (userId) => {
    try {
      const response = await fetch('/api/assign-mod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        fetchMods()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error assigning mod:', error)
    }
  }

  const removeMod = async (userId) => {
    try {
      const response = await fetch('/api/remove-mod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        fetchMods()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error removing mod:', error)
    }
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
                <button
                  onClick={() => assignMod(user.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

