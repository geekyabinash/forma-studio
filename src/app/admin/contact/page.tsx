'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

interface ContactFormData {
  address: string
  phone: string
  email: string
  working_hours: string
  instagram_url: string
  facebook_url: string
  linkedin_url: string
  whatsapp_url: string
  footer_tagline: string
  footer_copyright: string
  footer_credit: string
}

const emptyForm: ContactFormData = {
  address: '',
  phone: '',
  email: '',
  working_hours: '',
  instagram_url: '',
  facebook_url: '',
  linkedin_url: '',
  whatsapp_url: '',
  footer_tagline: '',
  footer_copyright: '',
  footer_credit: '',
}

const inputClass =
  'w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 focus:outline-none focus:border-[#D4654A] transition-colors'
const labelClass = 'block font-josefin text-[#F5E6D0] text-sm mb-2'
const cardClass = 'bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10'

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
          instagram_url: data.contactInfo.instagramUrl || '',
          facebook_url: data.contactInfo.facebookUrl || '',
          linkedin_url: data.contactInfo.linkedinUrl || '',
          whatsapp_url: data.contactInfo.whatsappUrl || '',
          footer_tagline: data.contactInfo.footerTagline || '',
          footer_copyright: data.contactInfo.footerCopyright || '',
          footer_credit: data.contactInfo.footerCredit || '',
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
      toast.error(
        error instanceof Error ? error.message : 'Failed to save contact info'
      )
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
          Contact &amp; Footer
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Manage office contact details, social links, and footer text shown
          across the site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Office Contact ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Office Contact
          </h3>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="e.g., 123 Architecture Lane, Mumbai 400001"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="e.g., +91 99999 99999"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="e.g., hello@formastudio.in"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Working Hours</label>
              <input
                type="text"
                value={formData.working_hours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    working_hours: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="e.g., Mon - Fri: 9:00 AM - 6:00 PM | Sat: 10:00 AM - 2:00 PM"
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Use &ldquo;|&rdquo; to split lines on the contact page.
              </p>
            </div>
          </div>
        </div>

        {/* ── Social Links ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            Social Links
          </h3>
          <p className="font-josefin text-[#D4B896]/60 text-xs mb-6">
            Used by the footer and the contact page. Leave a field blank to
            hide that platform&rsquo;s icon.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input
                type="text"
                value={formData.instagram_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instagram_url: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="https://instagram.com/formastudio"
              />
            </div>
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input
                type="text"
                value={formData.facebook_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    facebook_url: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="https://facebook.com/formastudio"
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedin_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedin_url: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="https://linkedin.com/company/formastudio"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp URL</label>
              <input
                type="text"
                value={formData.whatsapp_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    whatsapp_url: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="https://wa.me/919999999999"
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Also powers the floating WhatsApp button.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer Text ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            Footer Text
          </h3>
          <p className="font-josefin text-[#D4B896]/60 text-xs mb-6">
            Branding lines shown in the global footer.
          </p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Brand Tagline</label>
              <input
                type="text"
                value={formData.footer_tagline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    footer_tagline: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Design with intent. Build with passion."
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Sits under the logo in the footer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Copyright</label>
                <input
                  type="text"
                  value={formData.footer_copyright}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      footer_copyright: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="© 2026 Forma Studio. All rights reserved."
                />
              </div>
              <div>
                <label className={labelClass}>Credit Line</label>
                <input
                  type="text"
                  value={formData.footer_credit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      footer_credit: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Crafted with passion"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Contact &amp; Footer'}
          </button>
        </div>
      </form>
    </div>
  )
}
