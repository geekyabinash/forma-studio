'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#141B2B] flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </main>

        {/* Toast Notifications */}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#1A2332',
              color: '#F5E6D0',
              border: '1px solid rgba(245, 230, 208, 0.1)',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}
