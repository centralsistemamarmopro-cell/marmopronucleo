import './globals.css';

export const metadata = {
  title: 'MarmoPro — Gestão de Marmorarias',
  description: 'Plataforma operacional completa para marmorarias.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
