import { ARCHITECTURAL_PROJECTS } from '@/lib/data/projects';
import { FramedSection } from '@/components/frame/framed-section';
import { ProjectDetailStage } from '@/components/projects/project-detail-stage';

export function generateStaticParams() {
  return ARCHITECTURAL_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

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
