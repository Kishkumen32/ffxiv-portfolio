import styled from 'styled-components';
import AchievementGrid from '../components/AchievementGrid';
import { useXIVAPICharacter } from '../hooks/useCharacterData';
import LoadingSkeleton from '../components/LoadingSkeleton';

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

const LoadingWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default function Achievements() {
  const { data, loading, error } = useXIVAPICharacter();
  const achievements = data?.Character?.Achievements ?? [];

  return (
    <Page>
      <Section>
        <SectionTitle>
          Achievements
          <Count>{achievements.length}</Count>
        </SectionTitle>
        {loading ? (
          <LoadingWrapper>
            {Array.from({ length: 9 }).map((_, i) => (
              <LoadingSkeleton key={i} width="100%" height={64} radius={8} />
            ))}
          </LoadingWrapper>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-2xl)' }}>
            Failed to load achievements. {error}
          </div>
        ) : (
          <AchievementGrid achievements={achievements} />
        )}
      </Section>
    </Page>
  );
}
