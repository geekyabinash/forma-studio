'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { toast } from 'sonner'

interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

interface ProjectFormData {
  title: string
  slug: string
  category: string
  status: string
  year: number
  location: string
  area: string
  client: string
  description: string
  short_description: string
  hero_image: {
    url: string
    alt: string
    width: number
    height: number
  }
  gallery: GalleryImage[]
  featured: boolean
  sort_order: number
}

const categoryOptions = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'interior', label: 'Interior' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'renovation', label: 'Renovation' },
]

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'concept', label: 'Concept' },
]

const categoryBadgeColors: Record<string, string> = {
  residential: 'bg-emerald-500/20 text-emerald-400',
  commercial: 'bg-blue-500/20 text-blue-400',
  interior: 'bg-amber-500/20 text-amber-400',
  landscape: 'bg-green-500/20 text-green-400',
  renovation: 'bg-purple-500/20 text-purple-400',
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    category: 'residential',
    status: 'concept',
    year: new Date().getFullYear(),
    location: '',
    area: '',
    client: '',
    description: '',
    short_description: '',
    hero_image: {
      url: '',
      alt: '',
      width: 0,
      height: 0,
    },
    gallery: [],
    featured: false,
    sort_order: 0,
  })

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

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { url: '', alt: '', width: 0, height: 0 }],
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const updateGalleryImage = (index: number, updates: Partial<GalleryImage>) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img, i) =>
        i === index ? { ...img, ...updates } : img
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create project')
      }

      toast.success('Project created successfully')
      router.push('/admin/projects')
    } catch (error) {
      console.error('Create project error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
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
            Create New Project
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Add a new portfolio project
          </p>
        </div>
      </div>

      {/* Split View: Form + Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Basic Info */}
            <div>
              <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10">
                Basic Info
              </h3>
              <div className="space-y-4">
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
                    placeholder="e.g., Modern Lakeside Villa"
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
                    placeholder="e.g., modern-lakeside-villa"
                    required
                  />
                  <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                    Auto-generated from title, but you can customize it
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0]
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0]
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Details */}
            <div>
              <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10">
                Details
              </h3>
              <div className="space-y-4">
                {/* Year */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="e.g., 2024"
                    required
                  />
                </div>

                {/* Location */}
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
                    placeholder="e.g., Lake Geneva, Switzerland"
                    required
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, area: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="e.g., 4,500 sq ft"
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Client (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, client: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="e.g., Private Client"
                  />
                </div>
              </div>
            </div>

            {/* Section: Content */}
            <div>
              <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10">
                Content
              </h3>
              <div className="space-y-4">
                {/* Short Description */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, short_description: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="Brief one-line summary of the project"
                    required
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
                    rows={8}
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                    placeholder="Detailed description of the project..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Media */}
            <div>
              <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10">
                Media
              </h3>
              <div className="space-y-4">
                {/* Hero Image */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Hero Image
                  </label>
                  <ImageUploader
                    endpoint="generalUpload"
                    currentImage={formData.hero_image.url}
                    onUploadComplete={(url, width, height) => {
                      setFormData((prev) => ({
                        ...prev,
                        hero_image: {
                          ...prev.hero_image,
                          url,
                          width: width || 0,
                          height: height || 0,
                        },
                      }))
                    }}
                  />
                  {formData.hero_image.url && (
                    <div className="mt-3">
                      <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                        Hero Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero_image.alt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hero_image: { ...prev.hero_image, alt: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                          font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                          focus:outline-none focus:border-[#D4654A] transition-colors"
                        placeholder="Descriptive alt text for accessibility"
                      />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-josefin text-[#F5E6D0] text-sm">
                      Gallery Images
                    </label>
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                        hover:bg-[#D4654A]/90 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                  {formData.gallery.length > 0 && (
                    <div className="space-y-4">
                      {formData.gallery.map((image, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-josefin text-[#D4B896] text-sm">
                              Image {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="p-1 text-[#D4B896] hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <ImageUploader
                            endpoint="generalUpload"
                            currentImage={image.url}
                            onUploadComplete={(url, width, height) => {
                              updateGalleryImage(index, {
                                url,
                                width: width || 0,
                                height: height || 0,
                              })
                            }}
                          />
                          {image.url && (
                            <div className="mt-3">
                              <input
                                type="text"
                                value={image.alt}
                                onChange={(e) =>
                                  updateGalleryImage(index, { alt: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                                  focus:outline-none focus:border-[#D4654A] transition-colors"
                                placeholder="Image alt text"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Settings */}
            <div>
              <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10">
                Settings
              </h3>
              <div className="space-y-4">
                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="w-5 h-5 rounded border-[#F5E6D0]/20 bg-[#141B2B] text-[#D4654A]
                      focus:ring-[#D4654A] focus:ring-offset-0"
                  />
                  <label
                    htmlFor="featured"
                    className="font-josefin text-[#F5E6D0] text-sm cursor-pointer"
                  >
                    Featured Project
                  </label>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                      focus:outline-none focus:border-[#D4654A] transition-colors"
                    placeholder="0"
                  />
                </div>
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
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 sticky top-8 h-fit">
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-4">
            Live Preview
          </h3>
          <div className="space-y-6">
            {/* Project Card Preview */}
            <div className="bg-[#141B2B] rounded-xl overflow-hidden border border-[#F5E6D0]/10">
              {/* Hero Image */}
              {formData.hero_image.url ? (
                <div className="relative">
                  <img
                    src={formData.hero_image.url}
                    alt={formData.hero_image.alt || 'Project hero preview'}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-[#1A2332] flex items-center justify-center">
                  <p className="font-josefin text-[#D4B896]/40 text-sm">
                    Hero image preview
                  </p>
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                {formData.category && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-josefin text-xs font-medium capitalize mb-3
                      ${categoryBadgeColors[formData.category] || 'bg-gray-500/20 text-gray-400'}`}
                  >
                    {formData.category}
                  </span>
                )}

                <h4 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
                  {formData.title || 'Project Title'}
                </h4>

                <p className="font-josefin text-[#D4B896]/80 text-sm leading-relaxed mb-4">
                  {formData.short_description || 'Short description will appear here...'}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-xs font-josefin text-[#D4B896]">
                  {formData.year && <span>{formData.year}</span>}
                  {formData.location && <span>{formData.location}</span>}
                  {formData.area && <span>{formData.area}</span>}
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {formData.gallery.filter((img) => img.url).length > 0 && (
              <div>
                <h4 className="font-josefin text-[#D4B896] text-sm mb-3">Gallery</h4>
                <div className="grid grid-cols-3 gap-2">
                  {formData.gallery
                    .filter((img) => img.url)
                    .map((img, index) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border border-[#F5E6D0]/10"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `Gallery image ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
