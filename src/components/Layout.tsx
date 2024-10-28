import Header from '@/app/Header'
import Footer from '@/app/Footer'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
