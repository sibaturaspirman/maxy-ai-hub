import { cookies } from 'next/headers';
import { fetchProfile } from '@/lib/fetchProfile';
import { fetchBooth } from '@/lib/fetchBooth';
import GalaxyStudioHome from '@/components/pages/GalaxyStudioHome';
import GalaxyStudioProduct from '@/components/pages/GalaxyStudioProduct';
import GalaxyStudioExperience from '@/components/pages/GalaxyStudioExperience';

export default async function SectionPage({ params }) {
  const cookieStore = await cookies(); // <- now SSR compatible
  const token = cookieStore.get('tokenDataGSE')?.value;

  const { mallId, section } = await params; // await params in Next.js 16

  const profile = await fetchProfile(token);
  const boothData = await fetchBooth(token);

  // console.log(profile)

  const pages = {
    home: <GalaxyStudioHome profile={profile} mallId={mallId} />,
    product: <GalaxyStudioProduct profile={profile} mallId={mallId} />,
    experience: <GalaxyStudioExperience profile={profile} booth={boothData} malldata={mallId} />,
  };

  return pages[section] || <div>404 Not Found</div>;
}
