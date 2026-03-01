'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface ContactFormData {
  address: string
  phone: string
  email: string
  working_hours: string
}

const emptyForm: ContactFormData = {
  address: '',
  phone: '',
  email: '',
  working_hours: '',
}

export default function ContactInfoPage() {
  const [formData, setFormData] = useState<ContactFormData>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact-info')
      const data = await response.json()

      if (data.contactInfo) {
        setFormData({
          address: data.contactInfo.address || '',
          phone: data.contactInfo.phone || '',
          email: data.contactInfo.email || '',
          working_hours: data.contactInfo.workingHours || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error)
      toast.error('Failed to load contact info')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save contact info')
      }

      toast.success('Contact info saved successfully')
    } catch (error) {
      console.error('Save contact info error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save contact info')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading contact info...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
          Contact Info
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Manage your studio contact details
        </p>
      </div>

      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
              placeholder="e.g., 123 Architecture Ave, Suite 100, New York, NY 10001"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors"
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors"
              placeholder="e.g., hello@formastudio.com"
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Working Hours
            </label>
            <input
              type="text"
              value={formData.working_hours}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, working_hours: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors"
              placeholder="e.g., Mon - Fri: 9:00 AM - 6:00 PM | Sat: 10:00 AM - 2:00 PM"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-[#F5E6D0]/10">
            <button
              type="submit"
              className="px-8 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Contact Info'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
