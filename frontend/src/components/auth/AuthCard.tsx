import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className='w-full max-w-md rounded-3xl border border-white/10 bg-white/8 shadow-2xl backdrop-blur-xl'>
      <CardHeader className='space-y-3 px-8 pt-8 text-center'>
        <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/80 shadow-lg'>
          <span className='text-lg font-semibold text-white'>A</span>
        </div>

        <div className='space-y-1'>
          <CardTitle className='text-3xl font-semibold tracking-tight text-white'>
            {title}
          </CardTitle>
          <CardDescription className='text-sm leading-6 text-slate-300'>
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='px-8 pb-8'>{children}</CardContent>
    </Card>
  );
}
