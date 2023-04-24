import 'styles/global.css'
import styles from 'styles/App.module.scss'
import { Providers } from './providers'

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="Go-Events" />
      </head>
      <body style={{ margin: 0 }}>
        <main>
          <div className={styles.main}>
            <div className={styles.allCardsWrapper}>
              <Providers>{children}</Providers>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
