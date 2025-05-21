// frontend/app/admin/layout.tsx
'use client';

import { Toaster } from 'react-hot-toast';
import AuthCheck from '../components/AuthCheck';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AuthCheck />
        <Toaster position="top-right" />
        {children}
      </div>
    );
  }