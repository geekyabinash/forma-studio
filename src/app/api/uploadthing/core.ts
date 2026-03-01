import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  serviceImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new UploadThingError('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Service image uploaded by:', metadata.userId)
      return { url: file.ufsUrl }
    }),

  galleryImage: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new UploadThingError('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Gallery image uploaded by:', metadata.userId)
      return { url: file.ufsUrl }
    }),

  generalUpload: f({
    image: { maxFileSize: '8MB', maxFileCount: 4 },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new UploadThingError('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
