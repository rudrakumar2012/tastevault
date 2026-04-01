import { SessionProvider } from "next-auth/react";
import Navbar from '../components/Navbar';
import "./globals.css";

export const metadata = {
  title: 'TasteVault - Your Personal Recipe Vault',
  description: 'Discover, save, and organize your favorite recipes. Add notes and build your personal culinary vault.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}