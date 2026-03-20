import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <RegisterForm />
    </AuthPageLayout>
  );
}
