'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus, Edit, Trash2, Award, Heart } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { toast } from 'sonner'

type Tab = 'positions' | 'benefits' | 'values'

interface Position {
  id: string
  title: string
  department: string | null
  employment_type: string | null
  location: string
  is_active: boolean
}

interface Benefit {
  id: string
  icon: string
  title: string
  description: string
}

interface Value {
  id: string
  title: string
  description: string
}

export default function CareersAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('positions')
  const [loading, setLoading] = useState(true)
  const [positions, setPositions] = useState<Position[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [values, setValues] = useState<Value[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<Tab | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [positionsRes, benefitsRes, valuesRes] = await Promise.all([
        fetch('/api/admin/careers/positions'),
        fetch('/api/admin/careers/benefits'),
        fetch('/api/admin/careers/values'),
      ])

      const [positionsData, benefitsData, valuesData] = await Promise.all([
        positionsRes.json(),
        benefitsRes.json(),
        valuesRes.json(),
      ])

      setPositions(positionsData.positions || [])
      setBenefits(benefitsData.benefits || [])
      setValues(valuesData.values || [])
    } catch (error) {
      console.error('Failed to fetch careers data:', error)
      toast.error('Failed to load careers data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return

    try {
      const response = await fetch(
        `/api/admin/careers/${deleteType}/${deleteId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Delete failed')

      toast.success(
        `${deleteType.slice(0, -1).charAt(0).toUpperCase() + deleteType.slice(1, -1)} deleted successfully`
      )

      // Update local state
      if (deleteType === 'positions') {
        setPositions(positions.filter((p) => p.id !== deleteId))
      } else if (deleteType === 'benefits') {
        setBenefits(benefits.filter((b) => b.id !== deleteId))
      } else if (deleteType === 'values') {
        setValues(values.filter((v) => v.id !== deleteId))
      }

      setDeleteId(null)
      setDeleteType(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete item')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading careers...</p>
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
            Careers
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm">
            Manage job positions, benefits, and culture values
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#F5E6D0]/10 pb-0.5">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-3 py-2 md:px-6 md:py-3 font-josefin text-sm transition-all duration-300 rounded-t-lg
            ${
              activeTab === 'positions'
                ? 'bg-[#1A2332] text-[#D4654A] border-b-2 border-[#D4654A]'
                : 'text-[#D4B896] hover:text-[#F5E6D0] hover:bg-[#F5E6D0]/5'
            }`}
        >
          <Briefcase className="w-4 h-4 inline-block mr-2" />
          Positions ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-3 py-2 md:px-6 md:py-3 font-josefin text-sm transition-all duration-300 rounded-t-lg
            ${
              activeTab === 'benefits'
                ? 'bg-[#1A2332] text-[#D4654A] border-b-2 border-[#D4654A]'
                : 'text-[#D4B896] hover:text-[#F5E6D0] hover:bg-[#F5E6D0]/5'
            }`}
        >
          <Award className="w-4 h-4 inline-block mr-2" />
          Benefits ({benefits.length})
        </button>
        <button
          onClick={() => setActiveTab('values')}
          className={`px-3 py-2 md:px-6 md:py-3 font-josefin text-sm transition-all duration-300 rounded-t-lg
            ${
              activeTab === 'values'
                ? 'bg-[#1A2332] text-[#D4654A] border-b-2 border-[#D4654A]'
                : 'text-[#D4B896] hover:text-[#F5E6D0] hover:bg-[#F5E6D0]/5'
            }`}
        >
          <Heart className="w-4 h-4 inline-block mr-2" />
          Values ({values.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[#1A2332] rounded-xl border border-[#F5E6D0]/10 overflow-hidden">
        {/* Positions Tab */}
        {activeTab === 'positions' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
                Job Positions
              </h2>
              <button
                onClick={() => router.push('/admin/careers/positions/new')}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4654A] text-white rounded-lg
                  font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                  transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Position
              </button>
            </div>

            {positions.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
                <p className="font-josefin text-[#D4B896] mb-4">
                  No positions yet
                </p>
                <button
                  onClick={() => router.push('/admin/careers/positions/new')}
                  className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                    hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Position
                </button>
              </div>
            ) : (
              <div>
                {/* Desktop Table */}
                <table className="w-full hidden md:table">
                  <thead>
                    <tr className="border-b border-[#F5E6D0]/10">
                      <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                        Title
                      </th>
                      <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                        Department
                      </th>
                      <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                        Type
                      </th>
                      <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                        Location
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
                    {positions.map((position, index) => (
                      <tr
                        key={position.id}
                        className={`border-b border-[#F5E6D0]/5 hover:bg-[#F5E6D0]/5 transition-colors
                          ${index === positions.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <td className="p-4 font-josefin text-[#F5E6D0]">
                          {position.title}
                        </td>
                        <td className="p-4 font-josefin text-[#D4B896] text-sm capitalize">
                          {position.department?.replace('-', ' ') ?? ''}
                        </td>
                        <td className="p-4 font-josefin text-[#D4B896] text-sm capitalize">
                          {position.employment_type?.replace('-', ' ') ?? ''}
                        </td>
                        <td className="p-4 font-josefin text-[#D4B896] text-sm">
                          {position.location}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full font-josefin text-xs
                            ${
                              position.is_active
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}
                          >
                            {position.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                router.push(`/admin/careers/positions/${position.id}`)
                              }
                              className="p-2 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                                rounded-lg transition-all duration-300"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(position.id)
                                setDeleteType('positions')
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

                {/* Mobile Card List */}
                <div className="md:hidden space-y-3 p-4">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="bg-[#141B2B] rounded-xl p-4 border border-[#F5E6D0]/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-josefin text-[#F5E6D0] font-medium truncate">
                            {position.title}
                          </h3>
                          <p className="font-josefin text-[#D4B896] text-sm mt-0.5 capitalize">
                            {position.department?.replace('-', ' ') ?? ''} · {position.employment_type?.replace('-', ' ') ?? ''}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full font-josefin text-xs shrink-0 ml-2
                          ${
                            position.is_active
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {position.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="font-josefin text-[#D4B896] text-sm mb-3">
                        {position.location}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-[#F5E6D0]/10">
                        <button
                          onClick={() => router.push(`/admin/careers/positions/${position.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                            rounded-lg transition-all duration-300 font-josefin text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(position.id)
                            setDeleteType('positions')
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#D4B896] hover:text-red-400 hover:bg-red-400/10
                            rounded-lg transition-all duration-300 font-josefin text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
                Benefits & Perks
              </h2>
              <button
                onClick={() => router.push('/admin/careers/benefits/new')}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4654A] text-white rounded-lg
                  font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                  transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Benefit
              </button>
            </div>

            {benefits.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
                <p className="font-josefin text-[#D4B896] mb-4">No benefits yet</p>
                <button
                  onClick={() => router.push('/admin/careers/benefits/new')}
                  className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                    hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Benefit
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-[#141B2B] rounded-lg p-4 border border-[#F5E6D0]/10
                      hover:border-[#D4654A]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#D4654A]/10 rounded-lg">
                          <Award className="w-5 h-5 text-[#D4654A]" />
                        </div>
                        <div>
                          <h3 className="font-cormorant text-lg text-[#F5E6D0] mb-1">
                            {benefit.title}
                          </h3>
                          <p className="font-josefin text-[#D4B896] text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            router.push(`/admin/careers/benefits/${benefit.id}`)
                          }
                          className="p-1.5 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                            rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(benefit.id)
                            setDeleteType('benefits')
                          }}
                          className="p-1.5 text-[#D4B896] hover:text-red-400 hover:bg-red-400/10
                            rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Values Tab */}
        {activeTab === 'values' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-cormorant text-2xl text-[#F5E6D0]">
                Culture Values
              </h2>
              <button
                onClick={() => router.push('/admin/careers/values/new')}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4654A] text-white rounded-lg
                  font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
                  transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Value
              </button>
            </div>

            {values.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
                <p className="font-josefin text-[#D4B896] mb-4">No values yet</p>
                <button
                  onClick={() => router.push('/admin/careers/values/new')}
                  className="px-4 py-2 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
                    hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Value
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {values.map((value) => (
                  <div
                    key={value.id}
                    className="bg-[#141B2B] rounded-lg p-4 border border-[#F5E6D0]/10
                      hover:border-[#D4654A]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-cormorant text-lg text-[#F5E6D0] flex-1">
                        {value.title}
                      </h3>
                      <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            router.push(`/admin/careers/values/${value.id}`)
                          }
                          className="p-1.5 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
                            rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(value.id)
                            setDeleteType('values')
                          }}
                          className="p-1.5 text-[#D4B896] hover:text-red-400 hover:bg-red-400/10
                            rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-josefin text-[#D4B896] text-sm">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteId(null)
          setDeleteType(null)
        }}
        title={`Delete ${deleteType ? deleteType.slice(0, -1) : 'Item'}`}
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
