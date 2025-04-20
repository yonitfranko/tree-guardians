import { Metadata } from 'next';

interface PageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `תיעוד פעילות ${params.id}`,
  };
} 