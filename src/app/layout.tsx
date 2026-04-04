import type { Metadata } from "next";
import { Poppins, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareQueue – AI-Assisted Hospital Queue Optimization",
  description:
    "Smart hospital queue optimization powered by AI. Reducing patient wait time using intelligent prediction and scheduling optimization.",
  keywords: [
    "CareQueue",
    "Healthcare AI",
    "Hospital Queue",
    "Patient Wait Time",
    "AI Optimization",
    "Ballerina",
  ],
  authors: [{ name: "SHAIK MOHAMMED YASIN - Team Ballerina" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>",
  },
  openGraph: {
    title: "CareQueue – AI-Assisted Hospital Queue Optimization",
    description: "Reducing Patient Wait Time Using AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
