import { SessionProvider } from "next-auth/react";
import Navbar from '../components/Navbar';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0B0E14', margin: 0 }}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}