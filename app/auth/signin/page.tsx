import AuthForm from '../../../components/AuthForm';

export const metadata = {
  title: 'Sign In | TasteVault',
  description: 'Sign in to your TasteVault account to access your saved recipes and personal notes.',
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
