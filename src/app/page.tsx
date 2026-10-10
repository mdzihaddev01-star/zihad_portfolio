import { connection } from 'next/server';
import { Suspense } from 'react';
import HomeClient from './HomeClient';

async function RequestTimeHome() {
  await connection();
  return <HomeClient />;
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0c0c0e]" />}>
      <RequestTimeHome />
    </Suspense>
  );
}

