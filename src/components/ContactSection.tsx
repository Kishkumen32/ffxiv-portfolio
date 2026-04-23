import styled from 'styled-components';
import { CHARACTER } from '../api/constants';

const Section = styled.section`
  padding: var(--space-3xl) var(--space-lg);
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
`;

const LinkCard = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: transform var(--transition-fast), border-color var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent-gold);
    color: var(--accent-gold);
  }
`;

const PlatformLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export default function ContactSection() {
  return (
    <Section>
      <Title>Get In Touch</Title>
      <Links>
        <LinkCard href={`https://discord.com/users/${CHARACTER.discord}`} target="_blank" rel="noopener noreferrer">
          <PlatformLabel>Discord</PlatformLabel>
          {CHARACTER.discord}
        </LinkCard>
        <LinkCard href={`https://twitter.com/${CHARACTER.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
          <PlatformLabel>Twitter/X</PlatformLabel>
          {CHARACTER.twitter}
        </LinkCard>
      </Links>
    </Section>
  );
}
