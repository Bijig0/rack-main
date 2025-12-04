import { Header } from '@/components/layout/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] bg-light flex items-center justify-center py-8">
        {children}
      </main>
    </>
  );
}
