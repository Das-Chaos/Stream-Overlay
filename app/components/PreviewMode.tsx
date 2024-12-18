'use client'

import React from 'react'
import OverlayItem from './OverlayItem'

interface PreviewModeProps {
  items: any[]
}

export default function PreviewMode({ items }: PreviewModeProps) {
  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-gray-800 overflow-hidden">
      <div className="absolute inset-0">
        {items.map(item => (
          <OverlayItem
            key={item.id}
            item={item}
            updateItem={() => {}}
            removeItem={() => {}}
            onClick={() => {}}
            isPreview={true}
          />
        ))}
      </div>
    </div>
  )
}

