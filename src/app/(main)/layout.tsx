import { Header } from "@/components/layout/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex min-h-dvh flex-col">{children}</div>
    </div>
  );
}
