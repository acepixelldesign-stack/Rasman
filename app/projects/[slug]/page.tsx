import { FramedSection } from '@/components/frame/framed-section';
import { ProjectDetailStage } from '@/components/projects/project-detail-stage';

interface ProjectDetailPageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <FramedSection>
      <ProjectDetailStage slug={slug} />
    </FramedSection>
  );
}
