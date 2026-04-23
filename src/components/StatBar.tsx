import styled from 'styled-components';
import { useScrollEntrance } from '../hooks/useScrollEntrance';

const Bar = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  gap: var(--space-2xl);
  padding: var(--space-xl) var(--space-lg);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '16px'});
  transition: opacity var(--transition-base), transform var(--transition-base);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
  }
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-gold);
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: var(--space-xs);
`;

interface StatItem {
  value: string | number;
  label: string;
}

interface Props {
  stats: StatItem[];
}

export default function StatBar({ stats }: Props) {
  const { ref, visible } = useScrollEntrance();

  return (
    <Bar ref={ref} $visible={visible}>
      {stats.map((s, i) => (
        <Stat key={i}>
          <StatValue>{s.value}</StatValue>
          <StatLabel>{s.label}</StatLabel>
        </Stat>
      ))}
    </Bar>
  );
}
