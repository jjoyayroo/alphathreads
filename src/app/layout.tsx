import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Alphathreads - AI Image Generation',
  description: 'Generate amazing images with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
