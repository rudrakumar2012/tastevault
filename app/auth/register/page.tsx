import AuthForm from '../../../components/AuthForm';

export const metadata = {
  title: 'Create Account | TasteVault',
  description: 'Sign up for TasteVault to save and organize your favorite recipes. Start your culinary journey today.',
};

export default function RegisterPage() {
  return <AuthForm mode="signup" />;
}
