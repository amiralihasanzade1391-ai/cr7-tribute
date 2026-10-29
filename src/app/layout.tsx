import type { Metadata, Viewport } from "next";
import { Anton, Bebas_Neue, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorProvider } from "@/components/cursor/CursorContext";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The GOAT's — Cristiano Ronaldo Cinematic Tribute",
  description:
    "A legendary Awwwards-style cinematic tribute celebrating Cristiano Ronaldo. Explore all 7 eras, 981 career goals, trophies, and the road to 1,000.",
  keywords: [
    "Cristiano Ronaldo",
    "CR7",
    "The GOAT",
    "Football Legend",
    "Real Madrid",
    "Manchester United",
    "Juventus",
    "Al Nassr",
    "Portugal",
    "Ballon d'Or",
  ],
  authors: [{ name: "Cristiano Ronaldo Fan Tribute" }],
  openGraph: {
    title: "The GOAT's — Cristiano Ronaldo Cinematic Tribute",
    description: "An Awwwards-caliber interactive journey across all 7 eras of Cristiano Ronaldo.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${bebasNeue.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-white overflow-x-hidden">
        <AuthProvider>
          <SmoothScrollProvider>
            <CursorProvider>
              <CustomCursor />
              {children}
            </CursorProvider>
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}