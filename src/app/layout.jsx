import "./globals.css";
import { SessionProvider } from './providers'
import PayPalProvider from './components/PayPalProvider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })




export const metadata = {
  title: "QF ScreenCap - Screenshot & Screen Recording Tool",
  description: "Capture screenshots and record your screen with QF ScreenCap",
  icons: {
    icon: '/QFN-final-logo-black-line.-Edit.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PayPalProvider>
          <SessionProvider>{children}</SessionProvider>
        </PayPalProvider>
      </body>
    </html>
  )
}