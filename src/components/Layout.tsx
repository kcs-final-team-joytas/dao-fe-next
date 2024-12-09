import Header from '@/app/Header'
import Footer from '@/app/Footer'
import ClientEventSource from '@/utils/clientEvent'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ClientEventSource />
      <Header />
      {children}
      <Footer />
    </div>
  )
}
