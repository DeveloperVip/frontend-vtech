import ResetPasswordClient from './ResetPasswordClient';

type ResetPasswordPageProps = {
  searchParams?: {
    token?: string;
    type?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <ResetPasswordClient
      token={searchParams?.token || ''}
      type={searchParams?.type === 'admin' ? 'admin' : 'user'}
    />
  );
}
