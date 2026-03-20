import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AccountProfileSection() {
  return (
    <section className='rounded-2xl border border-slate-200 bg-slate-50/50 p-6'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-slate-900'>
          Account Profile
        </h2>
        <p className='mt-1 text-sm text-slate-500'>
          Profile settings will live here. For now, these fields are
          placeholders.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h3 className='text-base font-semibold text-slate-900'>Profile</h3>
          <div className='mt-4 space-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>Name</label>
              <Input
                value='Coming soon'
                disabled
              />
            </div>

            <Button
              type='button'
              variant='outline'
              disabled
            >
              Update Name
            </Button>
          </div>
        </div>

        <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h3 className='text-base font-semibold text-slate-900'>Security</h3>
          <div className='mt-4 space-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-slate-700'>
                Password
              </label>
              <Input
                type='password'
                value='placeholder'
                disabled
              />
            </div>

            <Button
              type='button'
              variant='outline'
              disabled
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
