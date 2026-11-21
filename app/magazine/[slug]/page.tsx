import { FramedSection } from '@/components/frame/framed-section';
import { BlogDetailStage } from '@/components/blog/blog-detail-stage';

interface MagazineArticlePageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function MagazineArticlePage({
  params,
}: MagazineArticlePageProps) {
  const { slug } = await params;

  return (
    <FramedSection>
      <BlogDetailStage slug={slug} />
    </FramedSection>
  );
}
