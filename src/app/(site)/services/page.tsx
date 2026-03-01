import { getServices } from '@/lib/data/fetch';
import ServicesContent from '@/components/services/ServicesContent';

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  return <ServicesContent services={services} />;
}
