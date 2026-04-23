import styled from 'styled-components';
import CharacterCard from '../components/CharacterCard';
import JobLevelGrid from '../components/JobLevelGrid';
import { useXIVAPICharacter } from '../hooks/useCharacterData';

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

export default function Character() {
  const { data, loading, error } = useXIVAPICharacter();
  const char = data?.Character;

  return (
    <Page>
      <Section>
        <SectionTitle>Character Overview</SectionTitle>
        <CharacterCard data={data ?? null} loading={loading} error={error} />
      </Section>

      <Section>
        <SectionTitle>Collection</SectionTitle>
        <BadgeRow>
          <Badge>
            <BadgeValue>{char?.Mounts?.length ?? '—'}</BadgeValue>
            <BadgeLabel>Mounts</BadgeLabel>
          </Badge>
          <Badge>
            <BadgeValue>{char?.Minions?.length ?? '—'}</BadgeValue>
            <BadgeLabel>Minions</BadgeLabel>
          </Badge>
          <Badge>
            <BadgeValue>{char?.Achievements?.length ?? '—'}</BadgeValue>
            <BadgeLabel>Achievements</BadgeLabel>
          </Badge>
          {char?.PlayTime != null && (
            <Badge>
              <BadgeValue>{Math.floor(char.PlayTime / 24)}d</BadgeValue>
              <BadgeLabel>Play Time ({char.PlayTime}h)</BadgeLabel>
            </Badge>
          )}
        </BadgeRow>
      </Section>

      <Section>
        <SectionTitle>Job Levels</SectionTitle>
        <JobLevelGrid classJobs={char?.ClassJobs} loading={loading} />
      </Section>
    </Page>
  );
}
