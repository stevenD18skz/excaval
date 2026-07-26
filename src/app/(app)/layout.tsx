import { Sidebar } from "@/components/excavla/sidebar";
import { BottomNav } from "@/components/excavla/bottom-nav";
import { StoreHydrator } from "@/components/excavla/store-hydrator";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <StoreHydrator />
      <Sidebar className="hidden lg:flex" />
      <div className="flex min-h-full flex-1 flex-col lg:h-screen lg:overflow-y-auto">
        {children}
      </div>
      <BottomNav className="lg:hidden" />
    </div>
  );
}
