"use client";

import { RequireAdmin } from "@/components/RequireAdmin";

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
