import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center bg-warm-50 px-4 py-8">
      <Suspense fallback={<p className="text-center text-sm text-warm-900/50">Loading…</p>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
