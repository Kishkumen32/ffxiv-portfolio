import styled from 'styled-components';
import { JOB_IDS, JOB_ROLES, ROLE_COLOR } from '../api/constants';
import type { XIVAPIClassJob } from '../api/xivapi';
import LoadingSkeleton from './LoadingSkeleton';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-sm);
`;

const JobCell = styled.div<{ $role: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  border-left: 3px solid ${p => ROLE_COLOR[p.$role] || 'var(--border-default)'};
  transition: transform var(--transition-fast), border-color var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    border-color: ${p => ROLE_COLOR[p.$role] || 'var(--accent-gold)'};
  }
`;

const JobName = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
`;

const JobLevel = styled.span<{ $maxed: boolean }>`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: ${p => p.$maxed ? 'var(--accent-gold)' : 'var(--text-primary)'};
`;

interface Props {
  classJobs: XIVAPIClassJob[] | undefined;
  loading: boolean;
}

export default function JobLevelGrid({ classJobs, loading }: Props) {
  if (loading) {
    return (
      <Grid>
        {Array.from({ length: 24 }).map((_, i) => (
          <LoadingSkeleton key={i} width={100} height={56} radius={4} />
        ))}
      </Grid>
    );
  }

  const jobs = (classJobs || [])
    .filter(j => j.Level > 0 && JOB_IDS[j.JobID])
    .sort((a, b) => b.Level - a.Level);

  return (
    <Grid>
      {jobs.map(j => {
        const abbr = JOB_IDS[j.JobID] || '???';
        const role = JOB_ROLES[abbr] || 'dps';
        return (
          <JobCell key={j.JobID} $role={role}>
            <JobName>{abbr}</JobName>
            <JobLevel $maxed={j.Level >= 100}>{j.Level}</JobLevel>
          </JobCell>
        );
      })}
    </Grid>
  );
}
