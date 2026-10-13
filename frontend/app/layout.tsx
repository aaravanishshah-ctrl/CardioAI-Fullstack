import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CardioAI — Clinical Decision Support',
  description: 'AI-Powered Clinical & Genomic Cardiovascular Risk Prediction',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
        <div>
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
