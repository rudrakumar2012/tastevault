import Navbar from '../components/Navbar';
import "./globals.css";

// This is where the 'children' prop belongs!
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0B0E14', margin: 0 }}>
        {/* We drop the Navbar in here so it shows on every page */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}