import { AdminHeaderActions } from "@/app/admin/_components/header/AdminHeaderActions";
import { AdminHeaderBrand } from "@/app/admin/_components/header/AdminHeaderBrand";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <AdminHeaderBrand />
        <AdminHeaderActions />
      </div>
    </header>
  );
}
