import { useState, useMemo } from 'react';
import styled from 'styled-components';
import JobTabs from '../components/JobTabs';
import FightHistoryTable from '../components/FightHistoryTable';
import ProgressionChart from '../components/ProgressionChart';
import { useTomestoneActivity, useTomestoneProgression } from '../hooks/useCharacterData';
import { CHARACTER } from '../api/constants';

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

export default function Raiding() {
  const { data: activityData, loading: activityLoading, error: activityError } = useTomestoneActivity();
  const { data: progressionData, loading: progressionLoading } = useTomestoneProgression();

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

  const filteredActivity = useMemo(() => {
    if (!activityData) return [];
    return activityData.filter(a => a.job === selectedJob);
  }, [activityData, selectedJob]);

  return (
    <Page>
      <Section>
        <SectionTitle>Raiding Profile</SectionTitle>
        <JobTabs jobs={jobs} selected={selectedJob} onSelect={setSelectedJob} />
        <FightHistoryTable activities={filteredActivity} loading={activityLoading} error={activityError} />
        <FFLogsLink
          href={`https://www.fflogs.com/character/na/${CHARACTER.server}/${CHARACTER.name.replace(' ', '%20')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View full FFLogs profile →
        </FFLogsLink>
      </Section>

      <Section>
        <SectionTitle>Progression</SectionTitle>
        <ProgressionChart data={progressionData ?? []} loading={progressionLoading} />
      </Section>
    </Page>
  );
}
