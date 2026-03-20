import { AccountProfileSection } from '@/components/settings/AccountProfileSection';
import { CategoriesSection } from '@/components/settings/CategoriesSection';

export default function SettingsPage() {
  return (
    <div className='mx-auto max-w-7xl space-y-8'>
      <div>
        <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
          Settings
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          Manage your account settings and category configuration.
        </p>
      </div>

      <AccountProfileSection />
      <CategoriesSection />
    </div>
  );
}
