import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import InteractiveParticles from "../components/InteractiveParticles/InteractiveParticles";
import BackgroundStars from "../components/BackgroundStars";
import PageBodyClass from "../components/PageBodyClass";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HUBly \u2014 Discover, Compare & Launch the World's Best AI & SaaS Tools",
  description: "The world's most advanced hub to discover, compare, and deploy AI tools, SaaS platforms, and automation software. Trusted by professionals worldwide.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="impact-site-verification" value="91cf02d1-76b7-4889-a2cd-ba0e04c45a2b" />
      </head>
      <body>
        <Providers>
          <PageBodyClass />
          <BackgroundStars />
          <InteractiveParticles />
          <div className="app-container is-ready">
            <Navbar />
            <main className="content">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
