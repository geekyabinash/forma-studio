'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Image,
  Inbox,
  FolderOpen,
  FileText,
  Phone,
  Settings,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Careers', href: '/admin/careers', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Inbox', href: '/admin/inbox', icon: Inbox },
  { name: 'About', href: '/admin/about', icon: FileText },
  { name: 'Contact', href: '/admin/contact', icon: Phone },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-[280px] bg-[#1A2332] border-r border-[#F5E6D0]/10 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#F5E6D0]/10">
        <h1 className="font-cormorant text-3xl text-[#F5E6D0] mb-1">
          Forma Studio
        </h1>
        <p className="font-josefin text-[#D4B896] text-xs tracking-wider uppercase">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-josefin text-sm
                transition-all duration-300 group
                ${
                  isActive
                    ? 'bg-[#D4654A] text-white shadow-lg shadow-[#D4654A]/20'
                    : 'text-[#F5E6D0] hover:bg-[#F5E6D0]/5 hover:text-[#D4654A]'
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-white' : 'text-[#D4B896] group-hover:text-[#D4654A]'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#F5E6D0]/10">
        <div className="mb-3 p-3 bg-[#141B2B] rounded-lg">
          <p className="font-josefin text-[#F5E6D0] text-sm truncate">
            {user?.email || 'Admin'}
          </p>
          <p className="font-josefin text-[#D4B896]/60 text-xs mt-0.5">
            Administrator
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-josefin text-sm
            text-[#F5E6D0] hover:bg-red-500/10 hover:text-red-400
            transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 text-[#D4B896] group-hover:text-red-400 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
