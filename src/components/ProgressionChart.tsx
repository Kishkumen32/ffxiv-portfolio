import styled from 'styled-components';
import type { TomestoneProgression } from '../api/tomestone';
import LoadingSkeleton from './LoadingSkeleton';

const ChartContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  overflow-x: auto;
`;

const ChartTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 200px;
  min-width: 400px;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  flex: 1;
  min-width: 8px;
  height: ${p => p.$height}%;
  background: ${p => p.$color};
  border-radius: 2px 2px 0 0;
  transition: height var(--transition-base);
  position: relative;

  &:hover::after {
    content: attr(data-label);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    pointer-events: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
`;

interface Props {
  data: TomestoneProgression[];
  loading: boolean;
}

export default function ProgressionChart({ data, loading }: Props) {
  if (loading) {
    return (
      <ChartContainer>
        <ChartTitle>Progression</ChartTitle>
        <LoadingSkeleton width="100%" height={200} radius={4} />
      </ChartContainer>
    );
  }

  if (!data.length) {
    return (
      <ChartContainer>
        <ChartTitle>Progression</ChartTitle>
        <EmptyState>No progression data available</EmptyState>
      </ChartContainer>
    );
  }

  const maxCleared = Math.max(...data.map(d => d.encounters_cleared), 1);

  return (
    <ChartContainer>
      <ChartTitle>Progression</ChartTitle>
      <BarChart>
        {data.map((d, i) => {
          const pct = (d.encounters_cleared / maxCleared) * 100;
          const color = pct >= 100 ? 'var(--accent-gold)' : pct >= 50 ? 'var(--accent-blue)' : 'var(--text-muted)';
          return (
            <Bar
              key={i}
              $height={Math.max(pct, 2)}
              $color={color}
              data-label={`${new Date(d.date).toLocaleDateString()}: ${d.encounters_cleared}/${d.total_encounters}`}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
}
