import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'DAO | 당신의 추억을 잊지마세요',
  description: '실시간 추억 공유 플래폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
