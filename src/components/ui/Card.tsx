import React, { HTMLAttributes } from 'react';

export default function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`} {...props} />;
}
