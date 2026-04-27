'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { careerPositionSchema, type CareerPositionValues } from '@/lib/schemas'
import {
  careerDepartmentOptions,
  employmentTypeOptions,
  type CareerDepartment,
  type EmploymentType,
} from '@/lib/admin/options'

export default function NewPositionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CareerPositionValues>({
    title: '',
    department: 'architecture',
    employment_type: 'full-time',
    location: '',
    experience: '',
    description: '',
    responsibilities: [],
    qualifications: [],
    posted_date: new Date().toISOString().split('T')[0],
    is_active: true,
  })
  const [responsibilityInput, setResponsibilityInput] = useState('')
  const [qualificationInput, setQualificationInput] = useState('')

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
      }))
      setResponsibilityInput('')
    }
  }

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }))
  }

  const addQualification = () => {
    if (qualificationInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, qualificationInput.trim()],
      }))
      setQualificationInput('')
    }
  }

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validated = careerPositionSchema.parse(formData)

      const response = await fetch('/api/admin/careers/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create position')
      }

      toast.success('Position created successfully')
      router.push('/admin/careers')
    } catch (error) {
      console.error('Create position error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create position')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#F5E6D0]/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#F5E6D0]" />
        </button>
        <div>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0]">
            Create New Position
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Add a new job opening
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Job Title *
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
              placeholder="e.g., Senior Architect"
              required
            />
          </div>

          {/* Department & Employment Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value as CareerDepartment,
                  }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] focus:outline-none focus:border-[#D4654A] transition-colors"
                required
              >
                {careerDepartmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Employment Type *
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employment_type: e.target.value as EmploymentType,
                  }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] focus:outline-none focus:border-[#D4654A] transition-colors"
                required
              >
                {employmentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., Mumbai, India"
                required
              />
            </div>

            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Experience (Optional)
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, experience: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., 5+ years"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={5}
              className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
              placeholder="Brief overview of the role and responsibilities..."
              required
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Responsibilities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addResponsibility()
                  }
                }}
                className="flex-1 px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="Enter a responsibility and press Add"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                  hover:bg-[#D4654A]/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.responsibilities.length > 0 && (
              <ul className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 p-3 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
                  >
                    <span className="flex-1 font-josefin text-[#F5E6D0] text-sm">
                      {resp}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="p-1 text-[#D4B896] hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
              Qualifications
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={qualificationInput}
                onChange={(e) => setQualificationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addQualification()
                  }
                }}
                className="flex-1 px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="Enter a qualification and press Add"
              />
              <button
                type="button"
                onClick={addQualification}
                className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                  hover:bg-[#D4654A]/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.qualifications.length > 0 && (
              <ul className="space-y-2">
                {formData.qualifications.map((qual, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 p-3 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
                  >
                    <span className="flex-1 font-josefin text-[#F5E6D0] text-sm">
                      {qual}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="p-1 text-[#D4B896] hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Posted Date & Active Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Posted Date
              </label>
              <input
                type="date"
                value={formData.posted_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, posted_date: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] focus:outline-none focus:border-[#D4654A] transition-colors"
              />
            </div>

            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg cursor-pointer hover:bg-[#F5E6D0]/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="w-5 h-5 text-[#D4654A] bg-[#141B2B] border-[#F5E6D0]/20 rounded
                    focus:ring-2 focus:ring-[#D4654A] focus:ring-offset-0"
                />
                <span className="font-josefin text-[#F5E6D0] text-sm">
                  Active (Visible on careers page)
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
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
              {loading ? 'Creating...' : 'Create Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
