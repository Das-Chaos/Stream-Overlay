'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

const socket = io('https://arcane-city.de')

export default function Overlay() {
  const { username } = useParams()
  const [overlayItems, setOverlayItems] = useState([])

  useEffect(() => {
    fetchOverlayItems()
    
    socket.emit('joinOverlay', username)

    socket.on('overlayUpdate', (updatedItems) => {
      setOverlayItems(updatedItems)
    })

    return () => {
      socket.off('overlayUpdate')
    }
  }, [username])

  const fetchOverlayItems = async () => {
    try {
      const response = await fetch(`https://arcane-city.de/api/overlay-items/${username}`)
      if (response.ok) {
        const data = await response.json()
        setOverlayItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching overlay items:', error)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {overlayItems.map(item => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: item.position.x,
            top: item.position.y,
            fontSize: `${item.style?.fontSize || 16}px`,
            color: item.style?.color || '#000000',
          }}
        >
          {item.type === 'text' && <p className="break-words max-w-full">{item.content}</p>}
          {item.type === 'image' && (
            <img
              src={item.content}
              alt="Overlay Item"
              style={{
                width: `${item.style?.size || 100}px`,
                height: `${item.style?.size || 100}px`,
                objectFit: 'cover',
              }}
              className="max-w-full h-auto"
            />
          )}
          {item.type === 'gif' && (
            <img
              src={item.content}
              alt="Overlay GIF"
              style={{
                width: `${item.style?.size || 100}px`,
                height: `${item.style?.size || 100}px`,
                objectFit: 'cover',
              }}
              className="max-w-full h-auto"
            />
          )}
          {item.type === 'sound' && (
            <audio autoPlay loop>
              <source src={item.content} type="audio/mpeg" />
            </audio>
          )}
        </div>
      ))}
    </div>
  )
}

