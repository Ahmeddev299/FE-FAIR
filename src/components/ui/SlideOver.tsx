// components/ui/SlideOver.tsx
'use client';
import React from 'react';
import { X } from 'lucide-react';

export default function SlideOver({
  open,
  title,
  subtitle,
  onClose,
  children,
}: React.PropsWithChildren<{
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[720px] bg-white shadow-xl border-l flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            {title ? <h3 className="text-base font-semibold text-gray-900">{title}</h3> : null}
            {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </aside>
    </div>
  );
}
