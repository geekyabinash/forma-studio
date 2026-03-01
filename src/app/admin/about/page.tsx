'use client'

import { useEffect, useState } from 'react'
import { Plus, X, Save, ChevronUp, ChevronDown, Users } from 'lucide-react'
import { toast } from 'sonner'
import ImageUploader from '@/components/admin/ImageUploader'

interface Milestone {
  year: string
  title: string
  description: string
}

interface TeamMemberImage {
  url: string
  alt: string
  width: number
  height: number
}

interface TeamMemberForm {
  name: string
  role: string
  bio: string
  sort_order: number
  image: TeamMemberImage
}

interface AboutFormData {
  hero_tagline: string
  hero_subtitle: string
  story_title: string
  story_paragraphs: string[]
  pull_quote: string
  pull_quote_attribution: string
  milestones: Milestone[]
  team_members: TeamMemberForm[]
}

const emptyTeamMember: TeamMemberForm = {
  name: '',
  role: '',
  bio: '',
  sort_order: 0,
  image: { url: '', alt: '', width: 0, height: 0 },
}

const emptyForm: AboutFormData = {
  hero_tagline: '',
  hero_subtitle: '',
  story_title: '',
  story_paragraphs: [],
  pull_quote: '',
  pull_quote_attribution: '',
  milestones: [],
  team_members: [],
}

export default function AboutContentPage() {
  const [formData, setFormData] = useState<AboutFormData>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/admin/about')
      const data = await response.json()

      if (data.about) {
        setFormData({
          hero_tagline: data.about.heroTagline || '',
          hero_subtitle: data.about.heroSubtitle || '',
          story_title: data.about.storyTitle || '',
          story_paragraphs: data.about.storyParagraphs || [],
          pull_quote: data.about.pullQuote || '',
          pull_quote_attribution: data.about.pullQuoteAttribution || '',
          milestones: data.about.milestones || [],
          team_members: data.about.teamMembers || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch about content:', error)
      toast.error('Failed to load about content')
    } finally {
      setLoading(false)
    }
  }

  // --- Story Paragraphs ---
  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      story_paragraphs: [...prev.story_paragraphs, ''],
    }))
  }

  const updateParagraph = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      story_paragraphs: prev.story_paragraphs.map((p, i) =>
        i === index ? value : p
      ),
    }))
  }

  const removeParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      story_paragraphs: prev.story_paragraphs.filter((_, i) => i !== index),
    }))
  }

  // --- Milestones ---
  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { year: '', title: '', description: '' }],
    }))
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  // --- Team Members ---
  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team_members: [
        ...prev.team_members,
        { ...emptyTeamMember, sort_order: prev.team_members.length },
      ],
    }))
  }

  const updateTeamMember = (
    index: number,
    field: keyof TeamMemberForm,
    value: string | number | TeamMemberImage
  ) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }))
  }

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index),
    }))
  }

  const moveTeamMember = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const members = [...prev.team_members]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= members.length) return prev
      ;[members[index], members[targetIndex]] = [members[targetIndex], members[index]]
      return {
        ...prev,
        team_members: members.map((m, i) => ({ ...m, sort_order: i })),
      }
    })
  }

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save about content')
      }

      toast.success('About content saved successfully')
    } catch (error) {
      console.error('Save about content error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save about content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading about content...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
          About Content
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Edit the About page content, story, and timeline
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Hero Section ── */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Hero Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Hero Tagline
              </label>
              <input
                type="text"
                value={formData.hero_tagline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero_tagline: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., About Forma Studio"
              />
            </div>
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={formData.hero_subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero_subtitle: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., Where Vision Meets Structure"
              />
            </div>
          </div>
        </div>

        {/* ── Studio Story ── */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Studio Story
          </h3>
          <div className="space-y-4">
            {/* Story Title */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Story Title
              </label>
              <input
                type="text"
                value={formData.story_title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, story_title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., Our Story"
              />
            </div>

            {/* Story Paragraphs */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Story Paragraphs
              </label>
              <div className="space-y-3">
                {formData.story_paragraphs.map((paragraph, index) => (
                  <div key={index} className="relative">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 pr-10 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                        font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                        focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                      placeholder={`Paragraph ${index + 1}...`}
                    />
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="absolute top-3 right-3 p-1 text-[#D4B896] hover:text-red-400
                        hover:bg-red-400/10 rounded transition-all duration-300"
                      title="Remove paragraph"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addParagraph}
                className="mt-3 px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#D4B896] text-sm hover:border-[#D4654A]/30
                  hover:text-[#F5E6D0] transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Paragraph
              </button>
            </div>

            {/* Pull Quote */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Pull Quote
              </label>
              <textarea
                value={formData.pull_quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pull_quote: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                placeholder="A standout quote from the studio..."
              />
            </div>

            {/* Pull Quote Attribution */}
            <div>
              <label className="block font-josefin text-[#F5E6D0] text-sm mb-2">
                Pull Quote Attribution (Optional)
              </label>
              <input
                type="text"
                value={formData.pull_quote_attribution}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pull_quote_attribution: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                  font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40
                  focus:outline-none focus:border-[#D4654A] transition-colors"
                placeholder="e.g., John Doe, Principal Architect"
              />
            </div>
          </div>
        </div>

        {/* ── Timeline Milestones ── */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-6">
            Timeline Milestones
          </h3>
          <div className="space-y-4">
            {formData.milestones.map((milestone, index) => (
              <div
                key={index}
                className="relative p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
              >
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="absolute top-3 right-3 p-1 text-[#D4B896] hover:text-red-400
                    hover:bg-red-400/10 rounded transition-all duration-300"
                  title="Remove milestone"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-[100px_1fr] gap-4 mb-3">
                  <div>
                    <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={milestone.year}
                      onChange={(e) =>
                        updateMilestone(index, 'year', e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                        font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                        focus:outline-none focus:border-[#D4654A] transition-colors"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, 'title', e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                        font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                        focus:outline-none focus:border-[#D4654A] transition-colors"
                      placeholder="Milestone title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                    Description
                  </label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(index, 'description', e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                      font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                      focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                    placeholder="Brief description of this milestone..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMilestone}
              className="px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#D4B896] text-sm hover:border-[#D4654A]/30
                hover:text-[#F5E6D0] transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </button>
          </div>
        </div>

        {/* ── Our Team ── */}
        <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-[#D4654A]" />
            <h3 className="font-cormorant text-2xl text-[#F5E6D0]">
              Our Team
            </h3>
            <span className="ml-auto font-josefin text-[#D4B896] text-sm">
              {formData.team_members.length} member{formData.team_members.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-6">
            {formData.team_members.map((member, index) => (
              <div
                key={index}
                className="relative p-5 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10"
              >
                {/* Controls: reorder + remove */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveTeamMember(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[#D4B896] hover:text-[#F5E6D0] disabled:opacity-30
                      disabled:cursor-not-allowed rounded transition-all duration-300"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTeamMember(index, 'down')}
                    disabled={index === formData.team_members.length - 1}
                    className="p-1 text-[#D4B896] hover:text-[#F5E6D0] disabled:opacity-30
                      disabled:cursor-not-allowed rounded transition-all duration-300"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="p-1 text-[#D4B896] hover:text-red-400
                      hover:bg-red-400/10 rounded transition-all duration-300"
                    title="Remove team member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
                  {/* Image Upload */}
                  <div>
                    <label className="block font-josefin text-[#D4B896] text-xs mb-2">
                      Photo
                    </label>
                    <ImageUploader
                      endpoint="generalUpload"
                      currentImage={member.image.url || undefined}
                      onUploadComplete={(url, width, height) => {
                        updateTeamMember(index, 'image', {
                          url,
                          alt: member.name ? `${member.name} at Forma Studio` : '',
                          width: width || 0,
                          height: height || 0,
                        })
                      }}
                    />
                  </div>

                  {/* Text Fields */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateTeamMember(index, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                            font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                            focus:outline-none focus:border-[#D4654A] transition-colors"
                          placeholder="e.g., Arjun Mehta"
                        />
                      </div>
                      <div>
                        <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) =>
                            updateTeamMember(index, 'role', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                            font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                            focus:outline-none focus:border-[#D4654A] transition-colors"
                          placeholder="e.g., Principal Architect"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                        Bio
                      </label>
                      <textarea
                        value={member.bio}
                        onChange={(e) =>
                          updateTeamMember(index, 'bio', e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                          font-josefin text-[#F5E6D0] placeholder-[#D4B896]/40 text-sm
                          focus:outline-none focus:border-[#D4654A] transition-colors resize-none"
                        placeholder="Short bio about this team member..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="px-4 py-2 bg-[#141B2B] border border-[#F5E6D0]/20 rounded-lg
                font-josefin text-[#D4B896] text-sm hover:border-[#D4654A]/30
                hover:text-[#F5E6D0] transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
              hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
