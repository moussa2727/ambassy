import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}