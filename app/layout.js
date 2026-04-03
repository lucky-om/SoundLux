import './globals.css';
import { CartProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SoundLux — Premium Headphones Store',
  description: 'Shop the best headphones from Sony, Bose, Apple, JBL, Sennheiser and more. Free shipping on orders above ₹5000.',
  keywords: 'headphones, wireless headphones, noise cancelling, gaming headphones, earbuds, Sony, Bose, Apple AirPods',
  referrer: 'no-referrer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>" />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main style={{ paddingTop: '68px' }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
