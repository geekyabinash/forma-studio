'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import ImageUploader from '@/components/admin/ImageUploader'
import { HOME_CONTENT_DEFAULTS } from '@/lib/data/fetch'

interface ImageAsset {
  url: string
  alt: string
  width: number
  height: number
}

interface HomeFormData {
  hero_video_url: string
  hero_tagline_line1: string
  hero_tagline_line2: string
  parallax_label: string
  parallax_image_bg: ImageAsset
  parallax_image_mid: ImageAsset
  parallax_image_fg: ImageAsset
  projects_count: number
  projects_count_label: string
  about_snippet_title: string
  about_snippet_body: string
  about_snippet_cta_text: string
  about_snippet_image: ImageAsset
  featured_work_label: string
  services_label: string
  cta_heading: string
  cta_subtitle: string
  cta_button_text: string
}

const emptyForm: HomeFormData = {
  hero_video_url: HOME_CONTENT_DEFAULTS.heroVideoUrl,
  hero_tagline_line1: HOME_CONTENT_DEFAULTS.heroTaglineLine1,
  hero_tagline_line2: HOME_CONTENT_DEFAULTS.heroTaglineLine2,
  parallax_label: HOME_CONTENT_DEFAULTS.parallaxLabel,
  parallax_image_bg: HOME_CONTENT_DEFAULTS.parallaxImageBg,
  parallax_image_mid: HOME_CONTENT_DEFAULTS.parallaxImageMid,
  parallax_image_fg: HOME_CONTENT_DEFAULTS.parallaxImageFg,
  projects_count: HOME_CONTENT_DEFAULTS.projectsCount,
  projects_count_label: HOME_CONTENT_DEFAULTS.projectsCountLabel,
  about_snippet_title: HOME_CONTENT_DEFAULTS.aboutSnippetTitle,
  about_snippet_body: HOME_CONTENT_DEFAULTS.aboutSnippetBody,
  about_snippet_cta_text: HOME_CONTENT_DEFAULTS.aboutSnippetCtaText,
  about_snippet_image: HOME_CONTENT_DEFAULTS.aboutSnippetImage,
  featured_work_label: HOME_CONTENT_DEFAULTS.featuredWorkLabel,
  services_label: HOME_CONTENT_DEFAULTS.servicesLabel,
  cta_heading: HOME_CONTENT_DEFAULTS.ctaHeading,
  cta_subtitle: HOME_CONTENT_DEFAULTS.ctaSubtitle,
  cta_button_text: HOME_CONTENT_DEFAULTS.ctaButtonText,
}

const inputClass =
  'w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 focus:outline-none focus:border-[#D4654A] transition-colors'
const labelClass = 'block font-josefin text-[#F5E6D0] text-sm mb-2'
const cardClass = 'bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10'

const requiredImageFields: Array<{
  field:
    | 'parallax_image_bg'
    | 'parallax_image_mid'
    | 'parallax_image_fg'
    | 'about_snippet_image'
  label: string
}> = [
  { field: 'parallax_image_bg', label: 'Background Image' },
  { field: 'parallax_image_mid', label: 'Primary Image' },
  { field: 'parallax_image_fg', label: 'Secondary Image' },
  { field: 'about_snippet_image', label: 'About Snippet Image' },
]

export default function HomeContentPage() {
  const [formData, setFormData] = useState<HomeFormData>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHomeContent()
  }, [])

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home')
      const data = await response.json()

      if (data.home) {
        setFormData({
          hero_video_url:
            data.home.heroVideoUrl ?? HOME_CONTENT_DEFAULTS.heroVideoUrl,
          hero_tagline_line1:
            data.home.heroTaglineLine1 ??
            HOME_CONTENT_DEFAULTS.heroTaglineLine1,
          hero_tagline_line2:
            data.home.heroTaglineLine2 ??
            HOME_CONTENT_DEFAULTS.heroTaglineLine2,
          parallax_label:
            data.home.parallaxLabel ?? HOME_CONTENT_DEFAULTS.parallaxLabel,
          parallax_image_bg:
            data.home.parallaxImageBg ?? HOME_CONTENT_DEFAULTS.parallaxImageBg,
          parallax_image_mid:
            data.home.parallaxImageMid ??
            HOME_CONTENT_DEFAULTS.parallaxImageMid,
          parallax_image_fg:
            data.home.parallaxImageFg ?? HOME_CONTENT_DEFAULTS.parallaxImageFg,
          projects_count:
            data.home.projectsCount ?? HOME_CONTENT_DEFAULTS.projectsCount,
          projects_count_label:
            data.home.projectsCountLabel ??
            HOME_CONTENT_DEFAULTS.projectsCountLabel,
          about_snippet_title:
            data.home.aboutSnippetTitle ??
            HOME_CONTENT_DEFAULTS.aboutSnippetTitle,
          about_snippet_body:
            data.home.aboutSnippetBody ??
            HOME_CONTENT_DEFAULTS.aboutSnippetBody,
          about_snippet_cta_text:
            data.home.aboutSnippetCtaText ??
            HOME_CONTENT_DEFAULTS.aboutSnippetCtaText,
          about_snippet_image:
            data.home.aboutSnippetImage ??
            HOME_CONTENT_DEFAULTS.aboutSnippetImage,
          featured_work_label:
            data.home.featuredWorkLabel ??
            HOME_CONTENT_DEFAULTS.featuredWorkLabel,
          services_label:
            data.home.servicesLabel ?? HOME_CONTENT_DEFAULTS.servicesLabel,
          cta_heading:
            data.home.ctaHeading ?? HOME_CONTENT_DEFAULTS.ctaHeading,
          cta_subtitle:
            data.home.ctaSubtitle ?? HOME_CONTENT_DEFAULTS.ctaSubtitle,
          cta_button_text:
            data.home.ctaButtonText ?? HOME_CONTENT_DEFAULTS.ctaButtonText,
        })
      }
    } catch (error) {
      console.error('Failed to fetch home content:', error)
      toast.error('Failed to load home content')
    } finally {
      setLoading(false)
    }
  }

  const updateImage = (
    field:
      | 'parallax_image_bg'
      | 'parallax_image_mid'
      | 'parallax_image_fg'
      | 'about_snippet_image',
    url: string,
    width?: number,
    height?: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        url,
        alt: prev[field].alt,
        width: width ?? 0,
        height: height ?? 0,
      },
    }))
  }

  const updateImageAlt = (
    field:
      | 'parallax_image_bg'
      | 'parallax_image_mid'
      | 'parallax_image_fg'
      | 'about_snippet_image',
    alt: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], alt },
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const missingImage = requiredImageFields.find(
      ({ field }) => !formData[field].url.trim()
    )
    if (missingImage) {
      toast.error(`${missingImage.label} is required before saving`)
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save home content')
      }

      toast.success('Home content saved successfully')
    } catch (error) {
      console.error('Save home content error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to save home content'
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
          <p className="font-josefin text-[#D4B896]">Loading home content...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
          Home Content
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Edit landing page sections — hero, selected works, about snippet, and CTA
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Hero ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Hero Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Hero Video URL</label>
              <input
                type="text"
                value={formData.hero_video_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero_video_url: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="/video/hero-video.mp4 or https://..."
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                Path relative to /public, or a full URL.
              </p>
            </div>
            <div>
              <label className={labelClass}>Tagline Line 1</label>
              <input
                type="text"
                value={formData.hero_tagline_line1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero_tagline_line1: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="DESIGN WITH INTENT."
              />
            </div>
            <div>
              <label className={labelClass}>Tagline Line 2</label>
              <input
                type="text"
                value={formData.hero_tagline_line2}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero_tagline_line2: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="BUILD WITH PASSION."
              />
              <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                The last word renders in coral automatically.
              </p>
            </div>
          </div>
        </div>

        {/* ── Selected Works (Parallax) ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Selected Works Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Section Label</label>
              <input
                type="text"
                value={formData.parallax_label}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parallax_label: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Selected Works"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Background Image</label>
                <ImageUploader
                  endpoint="generalUpload"
                  currentImage={formData.parallax_image_bg.url || undefined}
                  onUploadComplete={(url, w, h) =>
                    updateImage('parallax_image_bg', url, w, h)
                  }
                />
                <input
                  type="text"
                  value={formData.parallax_image_bg.alt}
                  onChange={(e) =>
                    updateImageAlt('parallax_image_bg', e.target.value)
                  }
                  className={`${inputClass} mt-2 text-sm`}
                  placeholder="Alt text"
                />
              </div>
              <div>
                <label className={labelClass}>Primary Image</label>
                <ImageUploader
                  endpoint="generalUpload"
                  currentImage={formData.parallax_image_mid.url || undefined}
                  onUploadComplete={(url, w, h) =>
                    updateImage('parallax_image_mid', url, w, h)
                  }
                />
                <input
                  type="text"
                  value={formData.parallax_image_mid.alt}
                  onChange={(e) =>
                    updateImageAlt('parallax_image_mid', e.target.value)
                  }
                  className={`${inputClass} mt-2 text-sm`}
                  placeholder="Alt text"
                />
              </div>
              <div>
                <label className={labelClass}>Secondary Image</label>
                <ImageUploader
                  endpoint="generalUpload"
                  currentImage={formData.parallax_image_fg.url || undefined}
                  onUploadComplete={(url, w, h) =>
                    updateImage('parallax_image_fg', url, w, h)
                  }
                />
                <input
                  type="text"
                  value={formData.parallax_image_fg.alt}
                  onChange={(e) =>
                    updateImageAlt('parallax_image_fg', e.target.value)
                  }
                  className={`${inputClass} mt-2 text-sm`}
                  placeholder="Alt text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4">
              <div>
                <label className={labelClass}>Counter Number</label>
                <input
                  type="number"
                  min={0}
                  value={formData.projects_count}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projects_count: Number(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Counter Label</label>
                <input
                  type="text"
                  value={formData.projects_count_label}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projects_count_label: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Projects Delivered"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── About Snippet ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            About Snippet (&ldquo;Who We Are&rdquo;)
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={formData.about_snippet_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about_snippet_title: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Who We Are"
              />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea
                value={formData.about_snippet_body}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about_snippet_body: e.target.value,
                  }))
                }
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>CTA Link Text</label>
              <input
                type="text"
                value={formData.about_snippet_cta_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about_snippet_cta_text: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Learn more about us"
              />
            </div>
            <div>
              <label className={labelClass}>Image</label>
              <ImageUploader
                endpoint="generalUpload"
                currentImage={formData.about_snippet_image.url || undefined}
                onUploadComplete={(url, w, h) =>
                  updateImage('about_snippet_image', url, w, h)
                }
              />
              <input
                type="text"
                value={formData.about_snippet_image.alt}
                onChange={(e) =>
                  updateImageAlt('about_snippet_image', e.target.value)
                }
                className={`${inputClass} mt-2 text-sm`}
                placeholder="Alt text"
              />
            </div>
          </div>
        </div>

        {/* ── Section Headings ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Section Headings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Featured Work Heading</label>
              <input
                type="text"
                value={formData.featured_work_label}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured_work_label: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Featured Work"
              />
            </div>
            <div>
              <label className={labelClass}>Services Heading</label>
              <input
                type="text"
                value={formData.services_label}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    services_label: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="What We Do"
              />
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Closing CTA
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Heading</label>
              <input
                type="text"
                value={formData.cta_heading}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cta_heading: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Let's build something remarkable."
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <textarea
                value={formData.cta_subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cta_subtitle: e.target.value,
                  }))
                }
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Button Text</label>
              <input
                type="text"
                value={formData.cta_button_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cta_button_text: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Start Your Project"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Home Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
