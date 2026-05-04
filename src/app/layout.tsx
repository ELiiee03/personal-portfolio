import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lieca Jane Eleccion | Agentic AI Engineer',
  description: 'Portfolio of Lieca Jane "Elliee" Eleccion — Agentic AI Engineer and RAG developer based in Butuan City, Philippines.',
  openGraph: {
    title: 'Lieca Jane Eleccion | Agentic AI Engineer',
    description: 'Building agentic AI systems that reason, retrieve, and act.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/35 selection:text-accent-foreground">{children}</body>
    </html>
  );
}