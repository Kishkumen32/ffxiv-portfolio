import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { TomestoneActivity } from '../api/tomestone';
import PercentileBadge from './PercentileBadge';
import LoadingSkeleton from './LoadingSkeleton';

const PAGE_SIZE = 20;

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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-top: var(--space-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const PaginationButton = styled.button`
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), opacity var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--bg-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  text-align: center;
  flex: 1;
`;

interface Props {
  activities: TomestoneActivity[];
  loading: boolean;
  error: string | null;
}

export default function FightHistoryTable({ activities, loading, error }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activities]);

  const total = activities.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginated = useMemo(
    () => activities.slice(start, start + PAGE_SIZE),
    [activities, start],
  );

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
    <>
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
          {paginated.map((a, i) => (
            <Tr key={start + i}>
              <Td>{a.encounter_name || a.fight_name}</Td>
              <Td>{a.job}</Td>
              <Td>
                {a.percentile != null ? (
                  <PercentileBadge percentile={a.percentile} />
                ) : '-'}
              </Td>
              <Td><ClearedBadge $cleared={a.cleared}>{a.cleared ? 'Cleared' : 'Incomplete'}</ClearedBadge></Td>
              <Td>{new Date(a.date).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PaginationButton onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          {'<- Prev'}
        </PaginationButton>
        <PaginationInfo>
          Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total}
        </PaginationInfo>
        <PaginationButton onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
          {'Next ->'}
        </PaginationButton>
      </Pagination>
    </>
  );
}
