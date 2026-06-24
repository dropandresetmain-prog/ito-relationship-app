import Image from "next/image";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col overflow-hidden">
      <Image
        src="/scenes/thread-garden-morning.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.018 78 / 0.72) 0%, oklch(0.95 0.018 78 / 0.88) 45%, oklch(0.93 0.02 78 / 0.96) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.16 0.02 50 / 0.12) 70%, oklch(0.16 0.02 50 / 0.22))",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end safe-area-top safe-area-bottom">
        <Suspense
          fallback={
            <div className="px-5 pb-8">
              <p className="text-center text-sm text-muted-foreground">Loading…</p>
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
