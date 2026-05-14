import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InteractiveParticles from "../components/InteractiveParticles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HUBLY | Elite AI & SaaS Tool Directory",
  description: "Discover the best AI and SaaS tools for your workflow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <InteractiveParticles />
          <div className="app-container is-ready">
            <Navbar />
            <main className="content">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
