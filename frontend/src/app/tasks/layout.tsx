import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TasksLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();                  
  const token = cookieStore.get('access_token')?.value;

  if (!token) redirect('/signin');

  return <>{children}</>;
}
