'use client'

import { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Toaster } from 'sonner'
import { Menu, User } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#141B2B] flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-30 bg-[#1A2332] border-b border-[#F5E6D0]/10 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-[#F5E6D0] hover:bg-[#F5E6D0]/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-cormorant text-xl text-[#F5E6D0]">
              Forma Studio
            </h1>
            <div className="p-2 rounded-lg bg-[#F5E6D0]/5">
              <User className="w-5 h-5 text-[#D4B896]" />
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10">
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
