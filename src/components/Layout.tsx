import Header from '@/app/Header'
import Footer from '@/app/Footer'
import ClientEventSource from '@/utils/clientEvent'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ width: '100%', height: 'calc(100% - 50px)' }}>
      <ClientEventSource />
      <Header />
      {children}
      <Footer />
    </div>
  )
}
