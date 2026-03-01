'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderOpen, Plus, Edit, Trash2, Star } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  slug: string
  category: string
  status: string
  year: number
  location: string
  featured: boolean
  sort_order: number
  created_at: string
}

const categoryBadgeColors: Record<string, string> = {
  residential: 'bg-emerald-500/20 text-emerald-400',
  commercial: 'bg-blue-500/20 text-blue-400',
  interior: 'bg-amber-500/20 text-amber-400',
  landscape: 'bg-green-500/20 text-green-400',
  renovation: 'bg-purple-500/20 text-purple-400',
}

const statusBadgeColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-amber-500/20 text-amber-400',
  concept: 'bg-gray-500/20 text-gray-400',
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/projects/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      toast.success('Project deleted successfully')
      setProjects(projects.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete project')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
            Projects
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4654A] text-white rounded-lg
            font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
            transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Projects Table */}
      {projects.length === 0 ? (
        <div className="bg-[#1A2332] rounded-xl p-12 border border-[#F5E6D0]/10 text-center">
          <FolderOpen className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            No Projects Yet
          </h3>
          <p className="font-josefin text-[#D4B896] mb-6">
            Get started by creating your first project
          </p>
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="px-6 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
              hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="bg-[#1A2332] rounded-xl border border-[#F5E6D0]/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5E6D0]/10">
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Title
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Category
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Status
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Year
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Location
                </th>
                <th className="text-center p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Featured
                </th>
                <th className="text-right p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`border-b border-[#F5E6D0]/5 hover:bg-[#F5E6D0]/5 transition-colors
                    ${index === projects.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="p-4 font-josefin text-[#F5E6D0]">
                    {project.title}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-josefin text-xs font-medium capitalize
                        ${categoryBadgeColors[project.category] || 'bg-gray-500/20 text-gray-400'}`}
                    >
                      {project.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-josefin text-xs font-medium capitalize
                        ${statusBadgeColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 font-josefin text-[#D4B896] text-sm">
                    {project.year}
                  </td>
                  <td className="p-4 font-josefin text-[#D4B896] text-sm">
                    {project.location}
                  </td>
                  <td className="p-4 text-center">
                    {project.featured && (
                      <Star className="w-4 h-4 text-[#D4B896] fill-[#D4B896] mx-auto" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="p-2 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                          rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="p-2 text-[#D4B896] hover:text-red-400 hover:bg-red-400/10
                          rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
