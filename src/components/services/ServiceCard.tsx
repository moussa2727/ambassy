import type { ReactNode } from 'react';

export interface ServiceCardProps {
  title: string;
  children: ReactNode;
}

export function ServiceCard({ title, children }: ServiceCardProps) {
  return (
    <article className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-green-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{children}</p>
    </article>
  );
}
