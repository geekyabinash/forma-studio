'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, X, Eye, EyeOff } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { toast } from 'sonner'
import { serviceSchema, type ServiceFormValues } from '@/lib/schemas'
import {
  SERVICE_ICON_PRESETS,
  resolveServiceIconPath,
} from '@/lib/service-icons'

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [formData, setFormData] = useState<ServiceFormValues>({
    title: '',
    slug: '',
    short_title: '',
    description: '',
    icon: '',
    features: [],
    image_url: '',
    image_alt: '',
    image_width: 0,
    image_height: 0,
    featured_project_slug: '',
  })
  const [featureInput, setFeatureInput] = useState('')

  // Fetch existing service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`)
        if (!response.ok) throw new Error('Failed to fetch service')

        const { service } = await response.json()
        setFormData({
          title: service.title || '',
          slug: service.slug || '',
          short_title: service.shortTitle || service.short_title || '',
          description: service.description || '',
          icon: service.icon || '',
          features: service.features || [],
          image_url: service.imageUrl || service.image_url || '',
          image_alt: service.imageAlt || service.image_alt || '',
          image_width: service.imageWidth || service.image_width || 0,
          image_height: service.imageHeight || service.image_height || 0,
          featured_project_slug:
            service.featuredProjectSlug || service.featured_project_slug || '',
        })
      } catch (error) {
        console.error('Fetch service error:', error)
        toast.error('Failed to load service')
        router.push('/admin/services')
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchService()
    }
  }, [serviceId, router])

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }))
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate form data
      const validated = serviceSchema.parse(formData)

      // Submit to API
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update service')
      }

      toast.success('Service updated successfully')
      router.push('/admin/services')
    } catch (error) {
      console.error('Update service error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update service')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading service...</p>
        </div>
      </div>
    )
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
            Edit Service
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Update service details
          </p>
        </div>
      </div>

      {/* Split View: Form + Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className={`bg-[#1A2332] rounded-xl p-4 md:p-6 border border-[#F5E6D0]/10
          ${showPreview ? 'hidden lg:block' : 'block'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., Building Information Modeling (BIM)"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#D4B896] placeholder-[#D4B896]/40 text-sm
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., building-information-modeling"
                required
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Auto-generated from title, but you can customize it
              </p>
            </div>

            {/* Short Title */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Short Title (Optional)
              </label>
              <input
                type="text"
                value={formData.short_title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, short_title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., BIM"
              />
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
                rows={6}
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                placeholder="Detailed description of the service offering..."
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Icon
              </label>
              <p className="font-josefin text-[#D4B896]/60 text-xs mb-3">
                Pick a preset, or paste a custom SVG path. Leave blank for the
                default building icon.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                {SERVICE_ICON_PRESETS.map((preset) => {
                  const isActive = formData.icon === preset.key
                  return (
                    <button
                      type="button"
                      key={preset.key}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: preset.key }))
                      }
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        isActive
                          ? 'border-[#D4654A] bg-[#D4654A]/10'
                          : 'border-[#F5E6D0]/15 bg-[#141B2B] hover:border-[#D4654A]/40'
                      }`}
                      title={preset.label}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={32}
                        height={32}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          isActive ? 'text-[#D4654A]' : 'text-[#D4B896]'
                        }
                      >
                        <path d={preset.path} />
                      </svg>
                      <span className="font-josefin text-[10px] text-[#F5E6D0] text-center leading-tight">
                        {preset.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <details className="text-xs">
                <summary className="cursor-pointer font-josefin text-[#D4B896] hover:text-[#D4654A]">
                  Use a custom SVG path instead
                </summary>
                <textarea
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  rows={3}
                  className="mt-2 w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                    font-josefin text-[#D4B896] placeholder-[#D4B896]/40 text-sm font-mono
                    focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                  placeholder="e.g., M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"
                />
              </details>
            </div>

            {/* Features */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                    font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                    focus:outline-none focus:border-[#D4654A] transition-colors"
                  placeholder="Enter a feature and press Add"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                    hover:bg-[#D4654A]/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {formData.features.length > 0 && (
                <ul className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-3 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
                    >
                      <span className="flex-1 font-josefin text-[#F5E6D0] text-sm">
                        {feature}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-[#D4B896] hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Service Image
              </label>
              <ImageUploader
                endpoint="serviceImage"
                currentImage={formData.image_url}
                onUploadingChange={setIsImageUploading}
                onUploadComplete={(url, width, height) => {
                  setFormData((prev) => ({
                    ...prev,
                    image_url: url,
                    image_width: width || 0,
                    image_height: height || 0,
                  }))
                }}
              />
              {formData.image_url && (
                <div className="mt-3">
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image_alt: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="Descriptive alt text for accessibility"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
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
                disabled={saving || isImageUploading}
                title={isImageUploading ? 'Please wait for the image to finish uploading' : undefined}
              >
                {saving
                  ? 'Saving...'
                  : isImageUploading
                  ? 'Uploading image...'
                  : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div className={`bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 lg:sticky lg:top-8 h-fit
          ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-4">
            Live Preview
          </h3>
          <div className="space-y-6">
            {/* Service Card Preview */}
            <div className="bg-[#141B2B] rounded-xl p-6 border border-[#F5E6D0]/10">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-[#D4654A]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={resolveServiceIconPath(formData.icon)} />
                </svg>
              </div>
              <h4 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
                {formData.title || 'Service Title'}
              </h4>
              {formData.short_title && (
                <p className="font-josefin text-[#D4B896] text-sm mb-3">
                  {formData.short_title}
                </p>
              )}
              <p className="font-josefin text-[#D4B896]/80 text-sm leading-relaxed mb-4">
                {formData.description || 'Service description will appear here...'}
              </p>
              {formData.features.length > 0 && (
                <ul className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="font-josefin text-[#F5E6D0] text-sm flex items-start gap-2"
                    >
                      <span className="text-[#D4654A] mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div className="rounded-xl overflow-hidden border border-[#F5E6D0]/10">
                <img
                  src={formData.image_url}
                  alt={formData.image_alt || 'Service image preview'}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#1A2332] border-t border-[#F5E6D0]/10">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4654A] text-white rounded-lg
            font-josefin text-sm hover:bg-[#D4654A]/90 transition-colors"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Back to Form' : 'Preview'}
        </button>
      </div>
    </div>
  )
}
