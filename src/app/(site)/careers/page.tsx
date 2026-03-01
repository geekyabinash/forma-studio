import { getCareerPositions, getCareerBenefits, getCareerValues } from '@/lib/data/fetch';
import CareersContent from '@/components/careers/CareersContent';

export const revalidate = 60;

export default async function CareersPage() {
  const [positions, benefits, cultureValues] = await Promise.all([
    getCareerPositions(),
    getCareerBenefits(),
    getCareerValues(),
  ]);

  return (
    <CareersContent
      positions={positions}
      benefits={benefits}
      cultureValues={cultureValues}
    />
  );
}
