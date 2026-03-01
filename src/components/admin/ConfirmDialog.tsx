'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-[#1A2332] rounded-xl p-6 max-w-md w-full border border-[#F5E6D0]/10 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cormorant text-2xl text-[#F5E6D0] text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="font-josefin text-[#D4B896] text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-[#141B2B] border border-[#F5E6D0]/20
              rounded-lg font-josefin text-[#F5E6D0] text-sm
              hover:bg-[#F5E6D0]/5 hover:border-[#F5E6D0]/40
              transition-all duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-500 rounded-lg font-josefin text-white text-sm
              hover:bg-red-600 shadow-lg shadow-red-500/20
              transition-all duration-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
