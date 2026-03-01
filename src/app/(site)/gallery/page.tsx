import { getGalleryItems, getGalleryCategories } from '@/lib/data/fetch';
import GalleryContent from '@/components/gallery/GalleryContent';

export const revalidate = 60;

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ]);

  return <GalleryContent items={items} categories={categories} />;
}
