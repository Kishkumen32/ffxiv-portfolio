import styled from 'styled-components';
import { CHARACTER } from '../api/constants';

const FooterEl = styled.footer`
  padding: var(--space-xl) var(--space-lg);
  border-top: 1px solid var(--border-default);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  margin-top: var(--space-sm);
`;

const FooterLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-gold);
  }
`;

export default function Footer() {
  return (
    <FooterEl>
      <div>Built with FFXIV data via XIVAPI + Tomestone + FFLogs</div>
      <Links>
        <FooterLink
          href={`https://na.finalfantasyxiv.com/lodestone/character/${CHARACTER.lodestoneId}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Lodestone
        </FooterLink>
        <FooterLink
          href={`https://www.fflogs.com/character/na/${CHARACTER.server}/${CHARACTER.name.replace(' ', '%20')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          FFLogs
        </FooterLink>
        <FooterLink
          href="https://github.com/Kishkumen32/ffxiv-portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </FooterLink>
      </Links>
    </FooterEl>
  );
}
