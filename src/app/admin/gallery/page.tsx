'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, Plus, Edit, Trash2, Filter } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  imageUrl: string
  imageAlt?: string
  caption?: string
  category?: string
  projectSlug?: string
}

type CategoryFilter = 'all' | 'architecture' | 'interiors' | 'details' | 'process'

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    // Apply category filter
    if (categoryFilter === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter((item) => item.category === categoryFilter))
    }
  }, [categoryFilter, items])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/gallery')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch gallery items:', error)
      toast.error('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/gallery/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      toast.success('Gallery item deleted successfully')
      setItems(items.filter((item) => item.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete gallery item')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading gallery...</p>
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
            Gallery
          </h1>
          <p className="font-josefin text-[#D4B896] text-sm">
            Manage your project images
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/gallery/new')}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4654A] text-white rounded-lg
            font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
            transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-[#D4B896]" />
        <div className="flex gap-2">
          {(['all', 'architecture', 'interiors', 'details', 'process'] as CategoryFilter[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg font-josefin text-sm transition-all duration-300
                  ${
                    categoryFilter === cat
                      ? 'bg-[#D4654A] text-white shadow-lg shadow-[#D4654A]/20'
                      : 'bg-[#1A2332] text-[#D4B896] border border-[#F5E6D0]/10 hover:border-[#D4654A]/30'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#1A2332] rounded-xl p-12 border border-[#F5E6D0]/10 text-center">
          <ImageIcon className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            {categoryFilter === 'all' ? 'No Images Yet' : `No ${categoryFilter} Images`}
          </h3>
          <p className="font-josefin text-[#D4B896] mb-6">
            {categoryFilter === 'all'
              ? 'Get started by uploading your first image'
              : `Upload images in the ${categoryFilter} category`}
          </p>
          <button
            onClick={() => router.push('/admin/gallery/new')}
            className="px-6 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
              hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#1A2332] rounded-xl overflow-hidden border border-[#F5E6D0]/10
                hover:border-[#D4654A]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-[#141B2B]">
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-3">
                {item.caption && (
                  <p className="font-josefin text-[#F5E6D0] text-sm mb-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                {item.category && (
                  <span className="inline-block px-2 py-1 bg-[#D4654A]/10 text-[#D4654A] rounded text-xs font-josefin capitalize">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => router.push(`/admin/gallery/${item.id}`)}
                  className="p-2 bg-[#1A2332]/90 backdrop-blur-sm text-[#D4B896] hover:text-[#D4654A]
                    hover:bg-[#1A2332] rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 bg-[#1A2332]/90 backdrop-blur-sm text-[#D4B896] hover:text-red-400
                    hover:bg-[#1A2332] rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 flex items-center justify-center gap-6 font-josefin text-[#D4B896] text-sm">
        <span>Total: {items.length} images</span>
        {categoryFilter !== 'all' && <span>Filtered: {filteredItems.length} images</span>}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
