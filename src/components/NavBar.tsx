import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CHARACTER } from '../api/constants';

const Nav = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-lg);
  background: ${p => p.$scrolled ? 'rgba(13, 17, 23, 0.9)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(8px)' : 'none'};
  border-bottom: ${p => p.$scrolled ? '1px solid var(--border-default)' : '1px solid transparent'};
  z-index: 100;
  transition: background var(--transition-base), border var(--transition-base);
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-gold);
  letter-spacing: 0.05em;
  text-decoration: none;
`;

const NavLinks = styled.div<{ $open: boolean }>`
  display: flex;
  gap: var(--space-lg);
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: var(--nav-height);
    right: 0;
    bottom: 0;
    width: 260px;
    flex-direction: column;
    padding: var(--space-xl);
    gap: var(--space-lg);
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-default);
    transform: translateX(${p => p.$open ? '0' : '100%'});
    transition: transform var(--transition-base);
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${p => p.$active ? 'var(--accent-gold)' : 'var(--text-secondary)'};
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-gold);
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  padding: var(--space-sm);

  @media (max-width: 768px) {
    display: block;
  }
`;

const links = [
  { to: '/', label: 'Home' },
  { to: '/character', label: 'Character' },
  { to: '/raiding', label: 'Raiding' },
  { to: '/achievements', label: 'Achievements' },
];

export default function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Nav $scrolled={scrolled}>
      <Logo to="/">{CHARACTER.name.split(' ')[0]}</Logo>
      <Hamburger onClick={() => setMobileOpen(o => !o)}>
        {mobileOpen ? '✕' : '☰'}
      </Hamburger>
      <NavLinks $open={mobileOpen}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} $active={location.pathname === l.to}>
            {l.label}
          </NavLink>
        ))}
      </NavLinks>
    </Nav>
  );
}
