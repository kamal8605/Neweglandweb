import { type ReactNode } from "react";

// Auth pages (login, register) use a minimal layout — no NavBar/Footer
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-6 sm:py-10">
      {children}
    </div>
  );
}
