type AuthPageLayoutProps = {
  children: React.ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 text-slate-100'>
      {/* Background */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.10),_transparent_35%)]' />
      <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' />

      {/* Decorative glow */}
      <div className='absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800/30 blur-3xl' />

      <div className='relative z-10 flex min-h-screen flex-col px-4 py-8'>
        {/* Brand */}
        <div className='mx-auto w-full max-w-6xl'>
          <div className='mb-10 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800 shadow-md'>
              <span className='text-sm font-semibold text-slate-100'>A</span>
            </div>
            <div>
              <p className='text-base font-semibold tracking-tight text-white'>
                Aledgely
              </p>
              <p className='text-sm text-slate-400'>
                Business tracking for solo operators
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='relative flex flex-1 items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
}
