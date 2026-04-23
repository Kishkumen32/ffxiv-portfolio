import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { CHARACTER } from '../api/constants';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  position: relative;
`;

const Name = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  animation: ${fadeUp} 0.6s ease-out both;
`;

const ServerTag = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--accent-blue);
  background: var(--accent-blue-dim);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  margin-top: var(--space-md);
  animation: ${fadeUp} 0.6s ease-out 0.15s both;
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-top: var(--space-lg);
  animation: ${fadeUp} 0.6s ease-out 0.3s both;
`;

const CTA = styled(Link)`
  display: inline-block;
  margin-top: var(--space-xl);
  padding: var(--space-md) var(--space-xl);
  background: var(--accent-gold);
  color: var(--bg-primary);
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  animation: ${fadeUp} 0.6s ease-out 0.45s both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(201, 168, 76, 0.3);
    color: var(--bg-primary);
  }
`;

export default function HeroSection() {
  return (
    <Hero>
      <Name>{CHARACTER.name}</Name>
      <ServerTag>{CHARACTER.server} · {CHARACTER.datacenter}</ServerTag>
      <Tagline>Tank. Gunbreaker. Ultimate Raider.</Tagline>
      <CTA to="/raiding">View My Raiding Profile</CTA>
    </Hero>
  );
}
