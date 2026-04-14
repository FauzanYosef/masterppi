import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const DMSans = DM_Sans({
  variable: '--font-DM-Sans',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${DMSans.variable} antialiased dark:bg-darkmode`}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}