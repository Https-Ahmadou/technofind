import { redirect } from 'next/navigation';

// La racine redirige vers le feed principal
export default function Home() {
  redirect('/feed');
}
