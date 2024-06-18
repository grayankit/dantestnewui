import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import TopProgressBar from '@/app/components/TopProgressBar';
import NavBar from '@/app/components/NavBar';
import SideBar from './components/SideBar';
import { Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';
import Footer from '@/app/components/Footer';
// import Changelogs from '@/app/components/Changelogs';
import { HydrationOverlay } from '@builder.io/react-hydration-overlay';
// import {HydrationO}

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'dantotsu',
  description: 'Not just another anime streaming site.',
  keywords: [
    'anime',
    'anilist-tracker',
    'trending anime',
    'watch anime subbed',
    'watch anime dubbed',
    'latest anime episodes',
    'anime streaming sub',
    'anime streaming dub',
    'subbed anime online',
    'dubbed anime online',
    'new anime releases',
    'watch anime sub and dub',
    'anime episodes subtitles',
    'english dubbed anime',
    'subbed and dubbed series',
    'anime series updates',
    'anime episodes english sub',
    'anime episodes english dub',
    'latest subbed anime',
    'latest dubbed anime',
    'subbed anime streaming',
    'dubbed anime streaming',
    'dantotsu latest anime',
    'anime reviews',
    'top anime picks',
    'best anime series',
    'popular anime shows',
    'anime season premieres',
    'anime trailers',
    'anime spoilers',
    'anime news',
    'anime community',
    'anime discussions',
    'anime recommendations',
    'upcoming anime',
    'anime watching guide',
    'classic anime series',
    'anime OST',
    'anime movies',
    'anime forums',
    'anime merchandise',
    'anime fan art',
    'anime conventions',
    'anime blogs',
    'anime podcasts',
    'anime character rankings',
    'anime streaming platforms',
    'anime subscription services',
    'anime marathon sessions',
    'anime recap episodes',
    'anime episode summaries',
    'anime behind the scenes',
    'anime voice actors',
    'anime production studios',
    'anime fan theories',
    'anime episode reviews',
    'anime series finale',
    'anime opening themes',
    'anime ending themes',
    'anime cosplay',
    'anime memes',
    'anime quotes',
    'anime recommendations by genre',
    'anime release schedules',
    'anime countdowns',
    'anime previews',
    'anime live-action adaptations',
  ],
  icons: {
    icon: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={
          'h-full scrollbar scrollbar-track-sky-300 scrollbar-thumb-sky-700 ' +
          sourceSans.className
        }
      >
        <HydrationOverlay>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <NavBar />
              <SideBar/>
              <main>{children}</main>
              <Footer />
              {/* <Changelogs /> */}
            </Providers>
          </ThemeProvider>
          <TopProgressBar />
        </HydrationOverlay>
      </body>
    </html>
  );
}
