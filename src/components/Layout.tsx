import type { Metadata } from 'next'
import Header from '@/app/Header'
import Footer from '@/app/Footer'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
