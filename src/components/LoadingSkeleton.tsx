import styled from 'styled-components';

const Skeleton = styled.div<{ $w: string; $h: string; $r: number; $m: string }>`
  width: ${p => p.$w};
  height: ${p => p.$h};
  border-radius: ${p => p.$r}px;
  margin: ${p => p.$m};
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-default) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

interface Props {
  width: number | string;
  height: number | string;
  radius?: number;
  margin?: string;
}

export default function LoadingSkeleton({ width, height, radius = 8, margin = '0' }: Props) {
  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;
  return <Skeleton $w={w} $h={h} $r={radius} $m={margin} />;
}
