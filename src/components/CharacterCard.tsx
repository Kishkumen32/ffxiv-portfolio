import styled from 'styled-components';
import { CHARACTER } from '../api/constants';
import type { XIVAPICharacter } from '../api/xivapi';
import LoadingSkeleton from './LoadingSkeleton';

const Card = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
  transition: transform var(--transition-fast), border-color var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-gold);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  border: 2px solid var(--accent-gold);
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-primary);
`;

const ServerBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-blue);
  background: var(--accent-blue-dim);
  padding: 2px var(--space-sm);
  border-radius: var(--radius-sm);
  margin-left: var(--space-sm);
`;

const Bio = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: var(--space-sm);
  line-height: 1.5;
`;

const LodestoneLink = styled.a`
  display: inline-block;
  margin-top: var(--space-md);
  font-size: 0.85rem;
  color: var(--accent-blue);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-gold);
  }
`;

interface Props {
  data: XIVAPICharacter | null;
  loading: boolean;
  error: string | null;
}

export default function CharacterCard({ data, loading, error }: Props) {
  if (loading) {
    return (
      <Card>
        <LoadingSkeleton width={120} height={120} radius={8} />
        <div style={{ flex: 1 }}>
          <LoadingSkeleton width={200} height={28} />
          <LoadingSkeleton width={300} height={16} margin="12px 0 0 0" />
          <LoadingSkeleton width={250} height={16} margin="8px 0 0 0" />
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <Info>
          <Name>{CHARACTER.name}</Name>
          <ServerBadge>{CHARACTER.server} · {CHARACTER.datacenter}</ServerBadge>
          <Bio>Character data unavailable. Showing cached info.</Bio>
        </Info>
      </Card>
    );
  }

  const char = data.Character;

  return (
    <Card>
      <Avatar src={char.Avatar} alt={char.Name} />
      <Info>
        <Name>
          {char.Name}
          <ServerBadge>{char.Server} · {char.DC}</ServerBadge>
        </Name>
        {char.Bio && <Bio>{char.Bio}</Bio>}
        <LodestoneLink
          href={`https://na.finalfantasyxiv.com/lodestone/character/${CHARACTER.lodestoneId}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Lodestone →
        </LodestoneLink>
      </Info>
    </Card>
  );
}
