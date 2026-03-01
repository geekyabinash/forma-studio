'use client'

import { useEffect, useState } from 'react'
import { Mail, Briefcase, Filter, Eye, Archive, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { toast } from 'sonner'

type SubmissionType = 'contact' | 'career'
type StatusFilter = 'all' | 'unread' | 'read' | 'archived'

interface Submission {
  id: string
  type: SubmissionType
  data: Record<string, any>
  status: string
  notes?: string
  submitted_at: string
  read_at?: string
}

export default function InboxPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<SubmissionType>('contact')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [typeFilter, statusFilter, submissions])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/inbox')
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = submissions.filter((sub) => sub.type === typeFilter)

    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.status === statusFilter)
    }

    setFilteredSubmissions(filtered)
  }

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/inbox/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) throw new Error('Update failed')

      const { submission: updated } = await response.json()
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? updated : sub))
      )
      toast.success('Status updated')
      setSelectedSubmission(null)
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/inbox/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      setSubmissions((prev) => prev.filter((sub) => sub.id !== deleteId))
      toast.success('Submission deleted')
      setDeleteId(null)
      setSelectedSubmission(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete submission')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading inbox...</p>
        </div>
      </div>
    )
  }

  const contactCount = submissions.filter((s) => s.type === 'contact').length
  const careerCount = submissions.filter((s) => s.type === 'career').length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
          Inbox
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Manage form submissions and inquiries
        </p>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#F5E6D0]/10 pb-0.5">
        <button
          onClick={() => setTypeFilter('contact')}
          className={`px-6 py-3 font-josefin text-sm transition-all duration-300 rounded-t-lg
            ${
              typeFilter === 'contact'
                ? 'bg-[#1A2332] text-[#D4654A] border-b-2 border-[#D4654A]'
                : 'text-[#D4B896] hover:text-[#F5E6D0] hover:bg-[#F5E6D0]/5'
            }`}
        >
          <Mail className="w-4 h-4 inline-block mr-2" />
          Contact Forms ({contactCount})
        </button>
        <button
          onClick={() => setTypeFilter('career')}
          className={`px-6 py-3 font-josefin text-sm transition-all duration-300 rounded-t-lg
            ${
              typeFilter === 'career'
                ? 'bg-[#1A2332] text-[#D4654A] border-b-2 border-[#D4654A]'
                : 'text-[#D4B896] hover:text-[#F5E6D0] hover:bg-[#F5E6D0]/5'
            }`}
        >
          <Briefcase className="w-4 h-4 inline-block mr-2" />
          Career Applications ({careerCount})
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-[#D4B896]" />
        <div className="flex gap-2">
          {(['all', 'unread', 'read', 'archived'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-josefin text-sm transition-all duration-300
                ${
                  statusFilter === status
                    ? 'bg-[#D4654A] text-white shadow-lg shadow-[#D4654A]/20'
                    : 'bg-[#1A2332] text-[#D4B896] border border-[#F5E6D0]/10 hover:border-[#D4654A]/30'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-[#1A2332] rounded-xl p-12 border border-[#F5E6D0]/10 text-center">
          {typeFilter === 'contact' ? (
            <Mail className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
          ) : (
            <Briefcase className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
          )}
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            No {statusFilter !== 'all' ? statusFilter : ''} submissions
          </h3>
          <p className="font-josefin text-[#D4B896]">
            {statusFilter === 'all'
              ? `No ${typeFilter} submissions yet`
              : `No ${statusFilter} ${typeFilter} submissions`}
          </p>
        </div>
      ) : (
        <div className="bg-[#1A2332] rounded-xl border border-[#F5E6D0]/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5E6D0]/10">
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Date
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Name
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  {typeFilter === 'contact' ? 'Project Type' : 'Position'}
                </th>
                <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Status
                </th>
                <th className="text-right p-4 font-josefin text-[#D4B896] text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission, index) => (
                <tr
                  key={submission.id}
                  className={`border-b border-[#F5E6D0]/5 hover:bg-[#F5E6D0]/5 transition-colors cursor-pointer
                    ${index === filteredSubmissions.length - 1 ? 'border-b-0' : ''}`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <td className="p-4 font-josefin text-[#D4B896] text-sm">
                    {formatDate(submission.submitted_at)}
                  </td>
                  <td className="p-4 font-josefin text-[#F5E6D0]">
                    {submission.data.name}
                  </td>
                  <td className="p-4 font-josefin text-[#D4B896] text-sm capitalize">
                    {typeFilter === 'contact'
                      ? submission.data.projectType?.replace('-', ' ')
                      : submission.data.position}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full font-josefin text-xs
                      ${
                        submission.status === 'unread'
                          ? 'bg-blue-500/10 text-blue-400'
                          : submission.status === 'read'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSubmission(submission)
                        }}
                        className="p-2 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                          rounded-lg transition-all duration-300"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(submission.id)
                        }}
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

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSubmission(null)}
          />

          <div className="relative bg-[#1A2332] rounded-xl p-6 max-w-2xl w-full border border-[#F5E6D0]/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cormorant text-2xl text-[#F5E6D0]">
                {typeFilter === 'contact' ? 'Contact Inquiry' : 'Career Application'}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-[#F5E6D0]/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#F5E6D0]" />
              </button>
            </div>

            {/* Submission Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                  Submitted
                </label>
                <p className="font-josefin text-[#F5E6D0]">
                  {formatDate(selectedSubmission.submitted_at)}
                </p>
              </div>

              {Object.entries(selectedSubmission.data).map(([key, value]) => (
                <div key={key}>
                  <label className="block font-josefin text-[#D4B896] text-xs mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="font-josefin text-[#F5E6D0]">{String(value)}</p>
                </div>
              ))}

              {selectedSubmission.notes && (
                <div>
                  <label className="block font-josefin text-[#D4B896] text-xs mb-1">
                    Notes
                  </label>
                  <p className="font-josefin text-[#F5E6D0]">{selectedSubmission.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-[#F5E6D0]/10">
              {selectedSubmission.status !== 'read' && (
                <button
                  onClick={() => updateStatus(selectedSubmission.id, 'read')}
                  className="flex-1 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg
                    font-josefin text-sm hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Mark as Read
                </button>
              )}
              {selectedSubmission.status !== 'archived' && (
                <button
                  onClick={() => updateStatus(selectedSubmission.id, 'archived')}
                  className="flex-1 px-4 py-2 bg-gray-500/10 text-gray-400 rounded-lg
                    font-josefin text-sm hover:bg-gray-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
              <button
                onClick={() => setDeleteId(selectedSubmission.id)}
                className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg
                  font-josefin text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
