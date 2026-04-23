import { useState } from 'react';
import styled from 'styled-components';
import type { FallbackAchievement } from '../api/constants';
import { useScrollEntrance } from '../hooks/useScrollEntrance';

const Card = styled.div<{ $visible: boolean }>`
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: transform var(--transition-fast), border-color var(--transition-fast),
    opacity var(--transition-base);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '12px'});

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-gold);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const IconPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  flex: 1;
`;

const DateLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const Description = styled.div<{ $open: boolean }>`
  max-height: ${p => p.$open ? '200px' : '0'};
  overflow: hidden;
  transition: max-height var(--transition-base);
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  padding-top: ${p => p.$open ? 'var(--space-sm)' : '0'};
`;

const CATEGORY_ICONS: Record<string, string> = {
  Ultimate: '🏆',
  Raid: '⚔',
  Criterion: '🏰',
  Variant: '🔄',
  Duty: '📋',
  Legacy: '📜',
  Social: '👥',
  Crafting: '🔨',
};

interface Props {
  achievement: FallbackAchievement;
}

export default function AchievementCard({ achievement }: Props) {
  const { ref, visible } = useScrollEntrance(0.05);
  const [open, setOpen] = useState(false);

  return (
    <Card ref={ref} $visible={visible} onClick={() => setOpen(o => !o)}>
      <Header>
        <IconPlaceholder>{CATEGORY_ICONS[achievement.category] ?? '🏆'}</IconPlaceholder>
        <Name>{achievement.name}</Name>
        <DateLabel>{achievement.date}</DateLabel>
      </Header>
      <Description $open={open}>
        {achievement.description}
      </Description>
    </Card>
  );
}
