'use client'

import React from 'react'

export default function OverlayGrid({ children }) {
  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-gray-200 border border-gray-300 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1 pointer-events-none">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-gray-300 opacity-50" />
        ))}
      </div>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}

