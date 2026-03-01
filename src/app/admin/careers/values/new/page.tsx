'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { careerValueSchema, type CareerValueValues } from '@/lib/schemas'

export default function NewValuePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CareerValueValues>({
    title: '',
    description: '',
    sort_order: 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validated = careerValueSchema.parse(formData)

      const response = await fetch('/api/admin/careers/values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create value')
      }

      toast.success('Value created successfully')
      router.push('/admin/careers')
    } catch (error) {
      console.error('Create value error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create value')
    } finally {
      setLoading(false)
    }
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
            Create New Culture Value
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Add a new company culture value
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Value'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
