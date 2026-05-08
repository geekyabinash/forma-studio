'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { toast } from 'sonner'
import { galleryItemSchema, type GalleryItemValues } from '@/lib/schemas'
import {
  galleryCategoryOptions,
  type GalleryCategory,
} from '@/lib/admin/options'

export default function NewGalleryItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [formData, setFormData] = useState<GalleryItemValues>({
    image_url: '',
    image_alt: '',
    image_width: 0,
    image_height: 0,
    caption: '',
    category: 'architecture',
    project_slug: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validated = galleryItemSchema.parse(formData)

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create gallery item')
      }

      toast.success('Image uploaded successfully')
      router.push('/admin/gallery')
    } catch (error) {
      console.error('Create gallery item error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
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
            Upload Image
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm mt-1">
            Add a new image to the gallery
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Image *
              </label>
              <ImageUploader
                endpoint="galleryImage"
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
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Alt Text (Optional)
              </label>
              <input
                type="text"
                value={formData.image_alt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image_alt: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="Descriptive text for accessibility"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Caption (Optional)
              </label>
              <textarea
                value={formData.caption}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, caption: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                placeholder="Brief description of the image..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as GalleryCategory,
                  }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] focus:outline-none focus:border-[#D4654A] transition-colors"
              >
                {galleryCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Link */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Project Slug (Optional)
              </label>
              <input
                type="text"
                value={formData.project_slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, project_slug: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., urban-villa-residence"
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Link this image to a specific project
              </p>
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
                disabled={loading || isImageUploading || !formData.image_url}
                title={isImageUploading ? 'Please wait for the image to finish uploading' : undefined}
              >
                {loading
                  ? 'Uploading...'
                  : isImageUploading
                  ? 'Uploading image...'
                  : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Preview */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10 sticky top-8 h-fit">
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-4">Preview</h3>
          {formData.image_url ? (
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-xl border border-[#F5E6D0]/10">
                <img
                  src={formData.image_url}
                  alt={formData.image_alt || 'Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
              {formData.caption && (
                <p className="font-josefin text-[#D4B896] text-sm">{formData.caption}</p>
              )}
              {formData.category && (
                <span className="inline-block px-3 py-1 bg-[#D4654A]/10 text-[#D4654A] rounded-full text-xs font-josefin capitalize">
                  {formData.category}
                </span>
              )}
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center rounded-xl border-2 border-dashed border-[#F5E6D0]/20">
              <p className="font-josefin text-[#D4B896]/60 text-sm">
                Upload an image to see preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
