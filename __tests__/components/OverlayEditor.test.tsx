import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import OverlayEditor from '../../app/components/OverlayEditor'
import { SessionProvider } from 'next-auth/react'

// Mock the socket.io-client
jest.mock('socket.io-client', () => {
  const emit = jest.fn()
  const on = jest.fn()
  const socket = { emit, on }
  return jest.fn(() => socket)
})

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ items: [] }),
  })
) as jest.Mock

describe('OverlayEditor', () => {
  it('renders without crashing', () => {
    render(
      <SessionProvider session={null}>
        <OverlayEditor />
      </SessionProvider>
    )
    expect(screen.getByText('Add Text')).toBeInTheDocument()
    expect(screen.getByText('Add Image')).toBeInTheDocument()
    expect(screen.getByText('Add GIF')).toBeInTheDocument()
    expect(screen.getByText('Add Sound')).toBeInTheDocument()
  })

  it('adds a new text item when "Add Text" button is clicked', async () => {
    render(
      <SessionProvider session={null}>
        <OverlayEditor />
      </SessionProvider>
    )
    
    fireEvent.click(screen.getByText('Add Text'))

    expect(global.fetch).toHaveBeenCalledWith('/api/overlay-items', expect.any(Object))
  })

  // Add more tests for other functionalities
})

