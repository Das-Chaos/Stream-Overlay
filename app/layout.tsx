import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ToastProvider } from './components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stream Overlay Editor',
  description: 'Edit and manage your stream overlays',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  )
}

