'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PanelTop, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const NAV_TABS = [
  { path: '/projects', label: 'Projects' },
  { path: '/services', label: 'Services' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About' },
  { path: '/careers', label: 'Careers' },
  { path: '/contact', label: 'Contact' },
]

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  '/projects': true,
  '/services': true,
  '/gallery': true,
  '/about': true,
  '/careers': true,
  '/contact': true,
}

export default function NavigationSettingsPage() {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY)
  const [initialVisibility, setInitialVisibility] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/navigation-settings')
      if (res.ok) {
        const data = await res.json()
        setVisibility(data.visibility)
        setInitialVisibility(data.visibility)
      }
    } catch {
      toast.error('Failed to load navigation settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/navigation-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to save settings')
        return
      }

      const data = await res.json()
      setInitialVisibility(data.visibility)
      toast.success('Navigation settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function toggleTab(path: string) {
    setVisibility((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  const hasChanges = JSON.stringify(visibility) !== JSON.stringify(initialVisibility)

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 font-josefin text-[#D4B896] text-sm hover:text-[#D4654A] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0]">
          Navigation
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm mt-1">
          Control which pages are visible to visitors
        </p>
      </div>

      {/* Toggles Card */}
      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#D4654A]/10 rounded-lg">
            <PanelTop className="w-5 h-5 text-[#D4654A]" />
          </div>
          <div>
            <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
              Page Visibility
            </h2>
            <p className="font-josefin text-[#D4B896]/60 text-xs">
              Hidden pages will be inaccessible to visitors
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[#141B2B] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {NAV_TABS.map((tab) => (
              <div
                key={tab.path}
                className="flex items-center justify-between p-4 bg-[#141B2B] rounded-lg"
              >
                <div>
                  <p className="font-josefin text-[#F5E6D0] text-sm font-medium">
                    {tab.label}
                  </p>
                  <p className="font-josefin text-[#D4B896]/50 text-xs">
                    {tab.path}
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={visibility[tab.path] !== false}
                  onClick={() => toggleTab(tab.path)}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4654A]/30
                    ${visibility[tab.path] !== false ? 'bg-[#D4654A]' : 'bg-[#F5E6D0]/20'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300
                      ${visibility[tab.path] !== false ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full mt-6 py-3 px-6 bg-[#D4654A] text-white font-josefin text-sm tracking-wider uppercase
            rounded-lg shadow-lg shadow-[#D4654A]/20
            hover:bg-[#D4654A]/90 hover:shadow-xl hover:shadow-[#D4654A]/30
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
