'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      const isAdmin = userData.is_admin;
      const isAdminRoute = window.location.pathname.startsWith('/admin');

      if (isAdminRoute && !isAdmin) {
        router.push('/portal');
      } else if (!isAdminRoute && isAdmin) {
        router.push('/admin/creators');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  return null;
} 