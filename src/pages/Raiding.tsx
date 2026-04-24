import { useState, useMemo } from 'react';
import styled from 'styled-components';
import JobTabs from '../components/JobTabs';
import FightHistoryTable from '../components/FightHistoryTable';
import ProgressionChart from '../components/ProgressionChart';
import { useTomestoneActivity, useTomestoneProgression } from '../hooks/useCharacterData';
import { CHARACTER } from '../api/constants';

const FilterRow = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${p => p.$active ? 'var(--accent-blue)' : 'transparent'};
  color: ${p => p.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${p => p.$active ? 'var(--accent-blue)' : 'var(--border-default)'};
  border-radius: var(--radius-sm);
  padding: 4px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  &:hover {
    border-color: var(--accent-blue);
    color: ${p => p.$active ? 'white' : 'var(--accent-blue)'};
  }
`;

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

const FFLogsLink = styled.a`
  display: inline-block;
  margin-top: var(--space-lg);
  font-size: 0.85rem;
  color: var(--accent-blue);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-gold);
  }
`;

const UnavailableMessage = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export default function Raiding() {
  const { data: activityData, loading: activityLoading, error: activityError } = useTomestoneActivity();
  const { data: progressionData, loading: progressionLoading, error: progressionError } = useTomestoneProgression();

  const jobs = useMemo(() => {
    if (!activityData?.length) return [CHARACTER.mainJob];
    const jobSet = new Set(activityData.map(a => a.job));
    const sorted = Array.from(jobSet).sort((a, b) => {
      if (a === CHARACTER.mainJob) return -1;
      if (b === CHARACTER.mainJob) return 1;
      return a.localeCompare(b);
    });
    return sorted.length ? sorted : [CHARACTER.mainJob];
  }, [activityData]);

  const [selectedJob, setSelectedJob] = useState<string>(CHARACTER.mainJob);
  const [statusFilter, setStatusFilter] = useState<'all' | 'cleared' | 'incomplete'>('all');

  const filteredActivity = useMemo(() => {
    if (!activityData) return [];
    let filtered = activityData.filter(a => a.job === selectedJob);
    if (statusFilter === 'cleared') filtered = filtered.filter(a => a.cleared);
    if (statusFilter === 'incomplete') filtered = filtered.filter(a => !a.cleared);
    return filtered;
  }, [activityData, selectedJob, statusFilter]);

  const showActivityUnavailable = !activityLoading && (activityError || !activityData?.length);
  const showProgressionUnavailable = !progressionLoading && (progressionError || !progressionData?.length);

  return (
    <Page>
      <Section>
        <SectionTitle>Raiding Profile</SectionTitle>
        <JobTabs jobs={jobs} selected={selectedJob} onSelect={setSelectedJob} />
        <FilterRow>
          <FilterButton $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterButton>
          <FilterButton $active={statusFilter === 'cleared'} onClick={() => setStatusFilter('cleared')}>Cleared ✓</FilterButton>
          <FilterButton $active={statusFilter === 'incomplete'} onClick={() => setStatusFilter('incomplete')}>Incomplete ✗</FilterButton>
        </FilterRow>
        {showActivityUnavailable && !activityLoading ? (
          <UnavailableMessage>
            Activity data unavailable - check back soon.
            {activityError && <><br /><small>{activityError}</small></>}
          </UnavailableMessage>
        ) : (
          <FightHistoryTable
            key={`${selectedJob}-${statusFilter}`}
            activities={filteredActivity}
            loading={activityLoading}
            error={activityError}
          />
        )}
        <FFLogsLink
          href={`https://www.fflogs.com/character/na/${CHARACTER.server}/${CHARACTER.name.replace(' ', '%20')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {'View full FFLogs profile ->'}
        </FFLogsLink>
      </Section>

      <Section>
        <SectionTitle>Progression</SectionTitle>
        {showProgressionUnavailable && !progressionLoading ? (
          <UnavailableMessage>
            Progression data unavailable - check back soon.
            {progressionError && <><br /><small>{progressionError}</small></>}
          </UnavailableMessage>
        ) : (
          <ProgressionChart data={progressionData ?? []} loading={progressionLoading} />
        )}
      </Section>
    </Page>
  );
}

