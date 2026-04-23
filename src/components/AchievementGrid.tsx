import { useState } from 'react';
import styled from 'styled-components';
import type { FallbackAchievement } from '../api/constants';
import { ACHIEVEMENT_CATEGORIES, type AchievementCategory } from '../api/constants';
import AchievementCard from './AchievementCard';

const Container = styled.div``;

const FilterBar = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: var(--space-xs) var(--space-md);
  font-size: 0.8rem;
  font-weight: 500;
  color: ${p => p.$active ? 'var(--accent-gold)' : 'var(--text-secondary)'};
  background: ${p => p.$active ? 'var(--accent-gold-dim)' : 'var(--bg-tertiary)'};
  border: 1px solid ${p => p.$active ? 'var(--accent-gold)' : 'var(--border-default)'};
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--accent-gold)';
    border-color: var(--accent-gold);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
`;

interface Props {
  achievements: FallbackAchievement[];
}

export default function AchievementGrid({ achievements }: Props) {
  const [filter, setFilter] = useState<AchievementCategory | 'All'>('All');

  const filtered = filter === 'All'
    ? achievements
    : achievements.filter(a => a.category === filter);

  return (
    <Container>
      <FilterBar>
        <FilterBtn $active={filter === 'All'} onClick={() => setFilter('All')}>All</FilterBtn>
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <FilterBtn key={cat} $active={filter === cat} onClick={() => setFilter(cat)}>
            {cat}
          </FilterBtn>
        ))}
      </FilterBar>
      {filtered.length === 0 ? (
        <EmptyState>No achievements in this category</EmptyState>
      ) : (
        <Grid>
          {filtered.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </Grid>
      )}
    </Container>
  );
}
