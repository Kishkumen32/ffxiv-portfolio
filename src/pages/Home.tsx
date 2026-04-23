import styled from 'styled-components';
import HeroSection from '../components/HeroSection';
import StatBar from '../components/StatBar';
import ContactSection from '../components/ContactSection';
import { useTomestoneActivity } from '../hooks/useCharacterData';

const Page = styled.div`
  padding-top: var(--nav-height);
`;

const Section = styled.section`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  text-align: center;
`;

export default function Home() {
  const { data: activityData, loading, error } = useTomestoneActivity();

  const fightCount = loading ? '—' : (error ? '—' : (activityData?.length ?? '—'));

  return (
    <Page>
      <HeroSection />
      <Section>
        <SectionTitle>At a Glance</SectionTitle>
        <StatBar stats={[
          { value: fightCount, label: 'Fights Recorded' },
          { value: '2,000+', label: 'Achievements' },
          { value: '200+', label: 'Mounts' },
          { value: '400+', label: 'Minions' },
        ]} />
      </Section>
      <ContactSection />
    </Page>
  );
}
