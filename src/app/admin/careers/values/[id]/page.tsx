'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { careerValueSchema, type CareerValueValues } from '@/lib/schemas'

export default function EditValuePage() {
  const router = useRouter()
  const params = useParams()
  const valueId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CareerValueValues>({
    title: '',
    description: '',
    sort_order: 0,
  })

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await fetch(`/api/admin/careers/values/${valueId}`)
        if (!response.ok) throw new Error('Failed to fetch value')

        const { value } = await response.json()
        setFormData({
          title: value.title || '',
          description: value.description || '',
          sort_order: value.sort_order || 0,
        })
      } catch (error) {
        console.error('Fetch value error:', error)
        toast.error('Failed to load value')
        router.push('/admin/careers')
      } finally {
        setLoading(false)
      }
    }

    if (valueId) {
      fetchValue()
    }
  }, [valueId, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const validated = careerValueSchema.parse(formData)

      const response = await fetch(`/api/admin/careers/values/${valueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update value')
      }

      toast.success('Value updated successfully')
      router.push('/admin/careers')
    } catch (error) {
      console.error('Update value error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update value')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading value...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#F5E6D0]/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#F5E6D0]" />
        </button>
        <div>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0]">
            Edit Culture Value
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Update value details
          </p>
        </div>
      </div>

      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors"
              placeholder="e.g., Design Excellence"
              required
            />
          </div>

          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
              placeholder="Brief description of this culture value..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#F5E6D0]/10">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] text-sm hover:bg-[#F5E6D0]/5
                hover:border-[#F5E6D0]/40 transition-all duration-300"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
