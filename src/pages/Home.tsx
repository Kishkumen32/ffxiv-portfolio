import styled from 'styled-components';
import HeroSection from '../components/HeroSection';
import StatBar from '../components/StatBar';
import ContactSection from '../components/ContactSection';
import { useXIVAPICharacter, useTomestoneActivity } from '../hooks/useCharacterData';

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
  const { data: xivData } = useXIVAPICharacter();
  const { data: activityData } = useTomestoneActivity();

  const char = xivData?.Character;
  const achievementCount = char?.Achievements?.length ?? 0;
  const mountCount = char?.Mounts?.length ?? 0;
  const minionCount = char?.Minions?.length ?? 0;
  const fightCount = activityData?.length ?? 0;

  return (
    <Page>
      <HeroSection />
      <Section>
        <SectionTitle>At a Glance</SectionTitle>
        <StatBar stats={[
          { value: fightCount, label: 'Fights Recorded' },
          { value: achievementCount, label: 'Achievements' },
          { value: mountCount, label: 'Mounts' },
          { value: minionCount, label: 'Minions' },
        ]} />
      </Section>
      <ContactSection />
    </Page>
  );
}
