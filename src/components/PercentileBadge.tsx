import styled from 'styled-components';
import { getPercentileColor } from '../api/constants';

const Badge = styled.span<{ $color: string; $size: 'small' | 'large' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  border-radius: var(--radius-sm);
  background: ${p => p.$color}22;
  color: ${p => p.$color};
  border: 1px solid ${p => p.$color}44;
  ${p => p.$size === 'small' ? 'font-size: 0.75rem; padding: 2px 6px;' : 'font-size: 1rem; padding: 4px 10px;'}
`;

interface Props {
  percentile: number;
  size?: 'small' | 'large';
}

export default function PercentileBadge({ percentile, size = 'small' }: Props) {
  const color = getPercentileColor(percentile);
  return (
    <Badge $color={color} $size={size}>
      {percentile}%
    </Badge>
  );
}
