import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position='top-right'
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm text-slate-600',
          actionButton: 'bg-slate-900 text-slate-50 hover:bg-slate-800',
          cancelButton: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          success: '!border-emerald-200 !bg-emerald-50 !text-emerald-900',
          error: '!border-red-200 !bg-red-50 !text-red-900',
        },
      }}
      {...props}
    />
  );
}
