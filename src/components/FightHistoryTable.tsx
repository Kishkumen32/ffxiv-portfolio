import styled from 'styled-components';
import type { TomestoneActivity } from '../api/tomestone';
import PercentileBadge from './PercentileBadge';
import LoadingSkeleton from './LoadingSkeleton';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-default);
`;

const Td = styled.td`
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-muted);
  color: var(--text-primary);
`;

const Tr = styled.tr`
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const ClearedBadge = styled.span<{ $cleared?: boolean }>`
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: ${p => p.$cleared ? 'rgba(63, 185, 80, 0.15)' : 'rgba(248, 81, 73, 0.15)'};
  color: ${p => p.$cleared ? 'var(--accent-green)' : 'var(--accent-red)'};
`;

interface Props {
  activities: TomestoneActivity[];
  loading: boolean;
  error: string | null;
}

export default function FightHistoryTable({ activities, loading, error }: Props) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} width="100%" height={40} radius={4} margin="4px 0" />
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyState>Failed to load fight history. {error}</EmptyState>;
  }

  if (!activities.length) {
    return <EmptyState>No parses recorded</EmptyState>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Encounter</Th>
          <Th>Job</Th>
          <Th>Percentile</Th>
          <Th>Status</Th>
          <Th>Date</Th>
        </tr>
      </thead>
      <tbody>
        {activities.map((a, i) => (
          <Tr key={i}>
            <Td>{a.encounter_name || a.fight_name}</Td>
            <Td>{a.job}</Td>
            <Td>
              {a.percentile != null ? (
                <PercentileBadge percentile={a.percentile} />
              ) : '—'}
            </Td>
            <Td><ClearedBadge $cleared={a.cleared}>{a.cleared ? 'Cleared' : 'Incomplete'}</ClearedBadge></Td>
            <Td>{new Date(a.date).toLocaleDateString()}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
