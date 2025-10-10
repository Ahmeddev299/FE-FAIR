// src/components/landlord/loi/ui/GhostIconCircle.tsx
import type { ReactNode } from "react";

export default function GhostIconCircle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto h-12 w-12 rounded-full grid place-items-center bg-gray-100 text-gray-500">
      {children}
    </div>
  );
}
