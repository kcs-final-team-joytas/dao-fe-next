import Header from '@/app/Header'
import Footer from '@/app/Footer'
import ClientEventSource from '@/utils/clientEvent'
import styles from '@components/Layout.module.css'


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ClientEventSource />
      <Header />
      <div className={styles.childrenDiv}>{children}</div>
      <Footer />
    </div>
  )
}
