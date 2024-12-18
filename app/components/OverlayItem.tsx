'use client'

import { useDrag } from 'react-dnd'
import { useState } from 'react'

export default function OverlayItem({ item, updateItem, removeItem, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'overlay-item',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [isEditing, setIsEditing] = useState(false)

  const handleDrop = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    updateItem(item.id, { position: { x, y } })
  }

  const handleContentChange = (event) => {
    updateItem(item.id, { content: event.target.value })
  }

  const itemStyle = {
    position: 'absolute',
    left: item.position.x,
    top: item.position.y,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    fontSize: `${item.style?.fontSize || 16}px`,
    color: item.style?.color || '#000000',
  }

  const mediaStyle = {
    width: `${item.style?.size || 100}px`,
    height: `${item.style?.size || 100}px`,
    objectFit: 'cover',
  }

  return (
    <div
      ref={drag}
      style={itemStyle}
      onDragEnd={handleDrop}
      onClick={onClick}
      className="p-2 bg-white border border-gray-300 rounded shadow-sm"
    >
      {item.type === 'text' && (
        isEditing ? (
          <input
            type="text"
            value={item.content}
            onChange={handleContentChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <p onClick={() => setIsEditing(true)}>{item.content}</p>
        )
      )}
      {item.type === 'image' && (
        <img src={item.content || '/placeholder.svg'} alt="Overlay Image" style={mediaStyle} />
      )}
      {item.type === 'gif' && (
        <img src={item.content || '/placeholder.svg'} alt="Overlay GIF" style={mediaStyle} />
      )}
      {item.type === 'sound' && (
        <audio controls>
          <source src={item.content} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <button onClick={() => removeItem(item.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Remove</button>
    </div>
  )
}

