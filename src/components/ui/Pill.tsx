import React from 'react';

export type PillTone = 'neutral' | 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple';
const map: Record<PillTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  green:   'bg-green-100 text-green-700',
  yellow:  'bg-yellow-100 text-yellow-800',
  red:     'bg-red-100 text-red-700',
  blue:    'bg-blue-100 text-blue-700',
  gray:    'bg-gray-200 text-gray-700',
  purple :  'bg-gray-200 text-purple-700',
};

export default function Pill({
  tone = 'neutral',
  children,
  className = '',
}: React.PropsWithChildren<{ tone?: PillTone; className?: string }>) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[tone]} ${className}`}>
      {children}
    </span>
  );
}
