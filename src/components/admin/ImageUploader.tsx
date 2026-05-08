'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from 'sonner'

interface ImageUploaderProps {
  endpoint: 'serviceImage' | 'galleryImage' | 'generalUpload'
  onUploadComplete: (url: string, width?: number, height?: number) => void
  currentImage?: string
  maxSizeMB?: number
}

export default function ImageUploader({
  endpoint,
  onUploadComplete,
  currentImage,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [progress, setProgress] = useState(0)

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        setProgress(100)
        toast.success('Image uploaded successfully')
      }
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
      setPreview(null)
    },
  })

  useEffect(() => {
    if (!isUploading) {
      setPreview(currentImage || null)
    }
  }, [currentImage, isUploading])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        toast.error(`File size must be less than ${maxSizeMB}MB`)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      // Create preview and get dimensions
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      const img = new Image()
      img.src = objectUrl
      await new Promise((resolve) => {
        img.onload = resolve
      })
      const width = img.width
      const height = img.height

      // Upload via Uploadthing
      const result = await startUpload([file])
      if (result?.[0]) {
        onUploadComplete(result[0].ufsUrl, width, height)
      }
    },
    [maxSizeMB, onUploadComplete, startUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const removeImage = () => {
    setPreview(null)
    onUploadComplete('', 0, 0)
  }

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300
            ${
              isDragActive
                ? 'border-[#D4654A] bg-[#D4654A]/10'
                : 'border-[#F5E6D0]/20 hover:border-[#D4654A]/50 hover:bg-[#F5E6D0]/5'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`w-12 h-12 mx-auto mb-4 transition-colors ${
              isDragActive ? 'text-[#D4654A]' : 'text-[#D4B896]'
            }`}
          />
          <p className="font-josefin text-[#F5E6D0] mb-2">
            {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
          </p>
          <p className="font-josefin text-[#D4B896]/60 text-sm">
            or click to browse &bull; Max {maxSizeMB}MB
          </p>

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-[#141B2B] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#D4654A] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-josefin text-[#D4B896] text-sm mt-2">
                Uploading... {progress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border border-[#F5E6D0]/10">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600
              rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            type="button"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="w-4 h-4 text-white" />
            <span className="font-josefin text-white text-sm">
              Click X to remove
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
