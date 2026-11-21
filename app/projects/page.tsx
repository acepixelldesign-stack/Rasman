import { Suspense } from 'react';
import { FramedSection } from '@/components/frame/framed-section';
import { ProjectsStage } from '@/components/projects/projects-stage';

export default function ProjectsPage() {
  return (
    <FramedSection>
      <Suspense fallback={null}>
        <ProjectsStage />
      </Suspense>
    </FramedSection>
  );
}
