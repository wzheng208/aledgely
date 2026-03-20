import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
