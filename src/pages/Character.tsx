import styled from 'styled-components';
import CharacterCard from '../components/CharacterCard';
import JobLevelGrid from '../components/JobLevelGrid';
import { useTomestoneProfile } from '../hooks/useCharacterData';
import { FALLBACK_JOB_LEVELS } from '../api/constants';

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

const BadgeRow = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.85rem;
`;

const BadgeValue = styled.span`
  color: var(--accent-gold);
  font-weight: 700;
`;

const BadgeLabel = styled.span`
  color: var(--text-secondary);
`;

const UnavailableNote = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
  margin-top: var(--space-sm);
`;

export default function Character() {
  const { data, loading, error } = useTomestoneProfile();
  const profile = data ?? null;

  const jobLevels = profile?.job_levels ?? FALLBACK_JOB_LEVELS;
  const usingFallback = !profile?.job_levels;

  return (
    <Page>
      <Section>
        <SectionTitle>Character Overview</SectionTitle>
        <CharacterCard data={profile} loading={loading} error={error} />
      </Section>

      <Section>
        <SectionTitle>Collection</SectionTitle>
        <BadgeRow>
          <Badge>
            <BadgeValue>200+</BadgeValue>
            <BadgeLabel>Mounts</BadgeLabel>
          </Badge>
          <Badge>
            <BadgeValue>400+</BadgeValue>
            <BadgeLabel>Minions</BadgeLabel>
          </Badge>
          <Badge>
            <BadgeValue>2,000+</BadgeValue>
            <BadgeLabel>Achievements</BadgeLabel>
          </Badge>
        </BadgeRow>
      </Section>

      <Section>
        <SectionTitle>Job Levels</SectionTitle>
        <JobLevelGrid jobLevels={jobLevels} loading={loading} />
        {usingFallback && !loading && (
          <UnavailableNote>Showing estimated levels — live data unavailable</UnavailableNote>
        )}
      </Section>
    </Page>
  );
}
