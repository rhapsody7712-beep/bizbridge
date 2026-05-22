"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

export function Nav() {
  const pathname = usePathname();

  const roleLabel = pathname.startsWith("/buyer")
    ? "Buyer Portal"
    : pathname.startsWith("/seller")
    ? "Seller Portal"
    : null;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#185FA5]">
          <Building2 className="h-5 w-5" />
          BizBridge
        </Link>
        {roleLabel && (
          <span className="text-sm font-medium text-muted-foreground bg-blue-50 px-3 py-1 rounded-full">
            {roleLabel}
          </span>
        )}
      </div>
    </nav>
  );
}
