// app/blog/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verdure — Blog',
  description: 'Le blog tech & design qui respire.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}