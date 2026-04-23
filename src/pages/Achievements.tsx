import styled from 'styled-components';
import AchievementGrid from '../components/AchievementGrid';
import { FALLBACK_ACHIEVEMENTS } from '../api/constants';
import type { FallbackAchievement } from '../api/constants';

const Page = styled.div`
  padding-top: var(--nav-height);
`;

const Section = styled.section`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent-gold);
  margin-left: var(--space-sm);
`;

const DataSourceNote = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
  margin-bottom: var(--space-lg);
`;

const achievements: FallbackAchievement[] = FALLBACK_ACHIEVEMENTS;

export default function Achievements() {
  return (
    <Page>
      <Section>
        <SectionTitle>
          Achievements
          <Count>{achievements.length}</Count>
        </SectionTitle>
        <DataSourceNote>Showing notable achievements — full list coming soon</DataSourceNote>
        <AchievementGrid achievements={achievements} />
      </Section>
    </Page>
  );
}
