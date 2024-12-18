import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorHandler } from '../../app/components/ErrorHandler'

describe('ErrorHandler', () => {
  it('renders error message when error is provided', () => {
    const error = new Error('Test error message')
    render(<ErrorHandler error={error} />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('does not render anything when error is null', () => {
    const { container } = render(<ErrorHandler error={null} />)
    expect(container.firstChild).toBeNull()
  })
})

