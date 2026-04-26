'use client'

import { useEffect, useState } from 'react'
import { Save, ArrowUp, ArrowDown, X as XIcon } from 'lucide-react'
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
  featured_work_eyebrow: string
  featured_work_description: string
  featured_work_project_slugs: string[]
  featured_work_limit: number
  featured_work_cta_text: string
  featured_work_cta_link: string
  services_label: string
  services_eyebrow: string
  services_description: string
  services_service_slugs: string[]
  services_limit: number
  services_cta_text: string
  services_cta_link: string
  cta_heading: string
  cta_subtitle: string
  cta_button_text: string
}

interface PickerItem {
  slug: string
  title: string
  imageUrl?: string
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
  featured_work_eyebrow: HOME_CONTENT_DEFAULTS.featuredWorkEyebrow,
  featured_work_description: HOME_CONTENT_DEFAULTS.featuredWorkDescription,
  featured_work_project_slugs: HOME_CONTENT_DEFAULTS.featuredWorkProjectSlugs,
  featured_work_limit: HOME_CONTENT_DEFAULTS.featuredWorkLimit,
  featured_work_cta_text: HOME_CONTENT_DEFAULTS.featuredWorkCtaText,
  featured_work_cta_link: HOME_CONTENT_DEFAULTS.featuredWorkCtaLink,
  services_label: HOME_CONTENT_DEFAULTS.servicesLabel,
  services_eyebrow: HOME_CONTENT_DEFAULTS.servicesEyebrow,
  services_description: HOME_CONTENT_DEFAULTS.servicesDescription,
  services_service_slugs: HOME_CONTENT_DEFAULTS.servicesServiceSlugs,
  services_limit: HOME_CONTENT_DEFAULTS.servicesLimit,
  services_cta_text: HOME_CONTENT_DEFAULTS.servicesCtaText,
  services_cta_link: HOME_CONTENT_DEFAULTS.servicesCtaLink,
  cta_heading: HOME_CONTENT_DEFAULTS.ctaHeading,
  cta_subtitle: HOME_CONTENT_DEFAULTS.ctaSubtitle,
  cta_button_text: HOME_CONTENT_DEFAULTS.ctaButtonText,
}

const inputClass =
  'w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 focus:outline-none focus:border-[#D4654A] transition-colors'
const labelClass = 'block font-josefin text-[#F5E6D0] text-sm mb-2'
const cardClass = 'bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10'

function SlugPicker({
  items,
  selected,
  onToggle,
  onMove,
}: {
  items: PickerItem[]
  selected: string[]
  onToggle: (slug: string) => void
  onMove: (slug: string, direction: -1 | 1) => void
}) {
  const knownSlugs = new Set(items.map((i) => i.slug))
  const orphanedSelected = selected.filter((s) => !knownSlugs.has(s))

  const Thumb = ({ src, alt }: { src?: string; alt: string }) =>
    src && src.length > 0 ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="w-12 h-12 rounded object-cover border border-[#F5E6D0]/10 shrink-0"
      />
    ) : (
      <div className="w-12 h-12 rounded bg-[#141B2B] border border-dashed border-[#F5E6D0]/20 flex items-center justify-center shrink-0">
        <span className="font-josefin text-[10px] text-[#D4B896]/50">
          No image
        </span>
      </div>
    )

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-josefin text-[#D4B896] text-xs uppercase tracking-wider">
            Display order
          </p>
          <ol className="space-y-1.5">
            {selected.map((slug, index) => {
              const item = items.find((i) => i.slug === slug)
              const label = item?.title ?? slug
              return (
                <li
                  key={slug}
                  className="flex items-center gap-3 px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/15 rounded-lg"
                >
                  <span className="font-josefin text-[#D4B896] text-xs w-5">
                    {index + 1}.
                  </span>
                  <Thumb src={item?.imageUrl} alt={label} />
                  <span className="font-josefin text-[#F5E6D0] text-sm flex-1 truncate">
                    {label}
                    {!item && (
                      <span className="ml-2 text-[#D4654A] text-xs">
                        (missing — click X to remove)
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => onMove(slug, -1)}
                    disabled={index === 0}
                    className="p-1 text-[#D4B896] hover:text-[#D4654A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(slug, 1)}
                    disabled={index === selected.length - 1}
                    className="p-1 text-[#D4B896] hover:text-[#D4654A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(slug)}
                    className="p-1 text-[#D4B896] hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-josefin text-[#D4B896] text-xs uppercase tracking-wider">
            Available
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
            {items
              .filter((i) => !selected.includes(i.slug))
              .map((item) => (
                <label
                  key={item.slug}
                  className="flex items-center gap-3 px-3 py-2 bg-[#141B2B]/60 border border-[#F5E6D0]/10 rounded-lg cursor-pointer hover:border-[#D4654A]/40 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => onToggle(item.slug)}
                    className="accent-[#D4654A] shrink-0"
                  />
                  <Thumb src={item.imageUrl} alt={item.title} />
                  <span className="font-josefin text-[#F5E6D0] text-sm truncate flex-1">
                    {item.title}
                  </span>
                </label>
              ))}
            {items.filter((i) => !selected.includes(i.slug)).length === 0 && (
              <p className="font-josefin text-[#D4B896]/60 text-xs col-span-full px-3 py-2">
                All items selected.
              </p>
            )}
          </div>
        </div>
      )}

      {orphanedSelected.length > 0 && (
        <p className="font-josefin text-[#D4654A] text-xs">
          {orphanedSelected.length} selected item(s) no longer exist. Remove
          them above.
        </p>
      )}
    </div>
  )
}

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
  const [availableProjects, setAvailableProjects] = useState<PickerItem[]>([])
  const [availableServices, setAvailableServices] = useState<PickerItem[]>([])

  useEffect(() => {
    fetchHomeContent()
    fetchPickerData()
  }, [])

  const fetchPickerData = async () => {
    try {
      const [projectsRes, servicesRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/services'),
      ])
      const projectsJson = await projectsRes.json()
      const servicesJson = await servicesRes.json()
      setAvailableProjects(
        (projectsJson.projects ?? []).map(
          (p: {
            slug: string
            title: string
            heroImage?: { url?: string } | null
          }) => ({
            slug: p.slug,
            title: p.title,
            imageUrl: p.heroImage?.url ?? '',
          })
        )
      )
      setAvailableServices(
        (servicesJson.services ?? []).map(
          (s: { slug: string; title: string; imageUrl?: string | null }) => ({
            slug: s.slug,
            title: s.title,
            imageUrl: s.imageUrl ?? '',
          })
        )
      )
    } catch (error) {
      console.error('Failed to fetch picker data:', error)
    }
  }

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
          featured_work_eyebrow:
            data.home.featuredWorkEyebrow ??
            HOME_CONTENT_DEFAULTS.featuredWorkEyebrow,
          featured_work_description:
            data.home.featuredWorkDescription ??
            HOME_CONTENT_DEFAULTS.featuredWorkDescription,
          featured_work_project_slugs:
            data.home.featuredWorkProjectSlugs ??
            HOME_CONTENT_DEFAULTS.featuredWorkProjectSlugs,
          featured_work_limit:
            data.home.featuredWorkLimit ??
            HOME_CONTENT_DEFAULTS.featuredWorkLimit,
          featured_work_cta_text:
            data.home.featuredWorkCtaText ??
            HOME_CONTENT_DEFAULTS.featuredWorkCtaText,
          featured_work_cta_link:
            data.home.featuredWorkCtaLink ??
            HOME_CONTENT_DEFAULTS.featuredWorkCtaLink,
          services_label:
            data.home.servicesLabel ?? HOME_CONTENT_DEFAULTS.servicesLabel,
          services_eyebrow:
            data.home.servicesEyebrow ??
            HOME_CONTENT_DEFAULTS.servicesEyebrow,
          services_description:
            data.home.servicesDescription ??
            HOME_CONTENT_DEFAULTS.servicesDescription,
          services_service_slugs:
            data.home.servicesServiceSlugs ??
            HOME_CONTENT_DEFAULTS.servicesServiceSlugs,
          services_limit:
            data.home.servicesLimit ?? HOME_CONTENT_DEFAULTS.servicesLimit,
          services_cta_text:
            data.home.servicesCtaText ??
            HOME_CONTENT_DEFAULTS.servicesCtaText,
          services_cta_link:
            data.home.servicesCtaLink ??
            HOME_CONTENT_DEFAULTS.servicesCtaLink,
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

  const toggleSlug = (
    field: 'featured_work_project_slugs' | 'services_service_slugs',
    slug: string
  ) => {
    setFormData((prev) => {
      const current = prev[field]
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug]
      return { ...prev, [field]: next }
    })
  }

  const moveSlug = (
    field: 'featured_work_project_slugs' | 'services_service_slugs',
    slug: string,
    direction: -1 | 1
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]]
      const i = arr.indexOf(slug)
      const j = i + direction
      if (i === -1 || j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...prev, [field]: arr }
    })
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

        {/* ── Featured Work Section ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            Featured Work Section
          </h3>
          <p className="font-josefin text-[#D4B896]/60 text-xs mb-6">
            Showcase the projects that lead the home page. Leave the project
            picker empty to fall back to the &ldquo;Featured&rdquo; flag set on
            individual projects.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
              <div>
                <label className={labelClass}>Eyebrow</label>
                <input
                  type="text"
                  value={formData.featured_work_eyebrow}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_work_eyebrow: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Selected Projects"
                />
              </div>
              <div>
                <label className={labelClass}>Heading</label>
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
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.featured_work_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured_work_description: e.target.value,
                  }))
                }
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Optional supporting paragraph that introduces this section"
              />
            </div>

            <div>
              <label className={labelClass}>Project Selection</label>
              <p className="font-josefin text-[#D4B896]/60 text-xs mb-3">
                {availableProjects.length === 0
                  ? 'Loading projects…'
                  : 'Tick projects to include them. Use the arrows to set display order. Leave all unchecked to use the global Featured flag.'}
              </p>
              <SlugPicker
                items={availableProjects}
                selected={formData.featured_work_project_slugs}
                onToggle={(slug) =>
                  toggleSlug('featured_work_project_slugs', slug)
                }
                onMove={(slug, dir) =>
                  moveSlug('featured_work_project_slugs', slug, dir)
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr_1fr] gap-4">
              <div>
                <label className={labelClass}>Display Limit</label>
                <input
                  type="number"
                  min={0}
                  value={formData.featured_work_limit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_work_limit: Number(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                />
                <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                  0 = no limit
                </p>
              </div>
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input
                  type="text"
                  value={formData.featured_work_cta_text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_work_cta_text: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="View all projects"
                />
                <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                  Leave blank to hide the CTA
                </p>
              </div>
              <div>
                <label className={labelClass}>CTA Link</label>
                <input
                  type="text"
                  value={formData.featured_work_cta_link}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_work_cta_link: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="/projects"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── What We Do (Services) Section ── */}
        <div className={cardClass}>
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            What We Do (Services) Section
          </h3>
          <p className="font-josefin text-[#D4B896]/60 text-xs mb-6">
            Curate the services overview that appears on the home page. Leave
            the service picker empty to show every service in its global sort
            order.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
              <div>
                <label className={labelClass}>Eyebrow</label>
                <input
                  type="text"
                  value={formData.services_eyebrow}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services_eyebrow: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Our Services"
                />
              </div>
              <div>
                <label className={labelClass}>Heading</label>
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
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.services_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    services_description: e.target.value,
                  }))
                }
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Optional supporting paragraph that introduces this section"
              />
            </div>

            <div>
              <label className={labelClass}>Service Selection</label>
              <p className="font-josefin text-[#D4B896]/60 text-xs mb-3">
                {availableServices.length === 0
                  ? 'Loading services…'
                  : 'Tick services to include them. Use the arrows to set display order. Leave all unchecked to show every service.'}
              </p>
              <SlugPicker
                items={availableServices}
                selected={formData.services_service_slugs}
                onToggle={(slug) =>
                  toggleSlug('services_service_slugs', slug)
                }
                onMove={(slug, dir) =>
                  moveSlug('services_service_slugs', slug, dir)
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr_1fr] gap-4">
              <div>
                <label className={labelClass}>Display Limit</label>
                <input
                  type="number"
                  min={0}
                  value={formData.services_limit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services_limit: Number(e.target.value) || 0,
                    }))
                  }
                  className={inputClass}
                />
                <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                  0 = no limit
                </p>
              </div>
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input
                  type="text"
                  value={formData.services_cta_text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services_cta_text: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="View all services"
                />
                <p className="font-josefin text-[#D4B896]/60 text-xs mt-1">
                  Leave blank to hide the CTA
                </p>
              </div>
              <div>
                <label className={labelClass}>CTA Link</label>
                <input
                  type="text"
                  value={formData.services_cta_link}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      services_cta_link: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="/services"
                />
              </div>
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
