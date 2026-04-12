import React from 'react';
import { Outlet } from 'react-router';
import { ShieldCheck, Sparkles, Waypoints } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.45),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.30),_transparent_28%),linear-gradient(135deg,#eaf2ff_0%,#f8fafc_48%,#fffaf0_100%)] px-4 py-8 md:px-8">
      <div className="absolute left-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-[#bfdbfe]/50 blur-3xl" />
      <div className="absolute bottom-[-7rem] right-[-6rem] h-72 w-72 rounded-full bg-[#fde68a]/45 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[32px] border border-white/60 bg-white/45 p-10 shadow-[0_30px_80px_rgba(37,99,235,0.10)] backdrop-blur lg:block">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#bfdbfe] bg-white/80 px-4 py-2 text-sm font-medium text-[#1d4ed8]">
            <Waypoints className="h-4 w-4" />
            LinkFlow
          </div>

          <div className="mt-8 max-w-xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">
              Manage every short link from one secure workspace.
            </h1>
            <p className="text-base leading-7 text-[#475569]">
              Sign in to monitor campaigns, create branded links, and keep your team focused on traffic growth instead
              of manual operations.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-[#0f172a]">
                <ShieldCheck className="h-5 w-5 text-[#2563eb]" />
                <span className="font-medium">Secure access</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Your workspace stays protected while you review account data, manage links, and move between pages.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-[#0f172a]">
                <Sparkles className="h-5 w-5 text-[#f59e0b]" />
                <span className="font-medium">Fast onboarding</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Create an account in minutes and start organizing performance links, QR codes, and campaign pages.
              </p>
            </div>
          </div>
        </section>

        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
