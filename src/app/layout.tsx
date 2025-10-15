import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export const metadata: Metadata = {
  title: 'Astral Legacy - Servidor de Minecraft',
  description: 'Servidor de Minecraft Astral Legacy - Aventure-se em um universo épico!',
  icons: {
    icon: '/images/512xnewhypixel.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className={jost.variable}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
