import styled from 'styled-components';
import { JOB_ROLES, ROLE_COLOR } from '../api/constants';

const TabBar = styled.div`
  display: flex;
  gap: var(--space-xs);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-default);
  margin-bottom: var(--space-lg);

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: 2px;
  }
`;

const Tab = styled.button<{ $active: boolean; $role: string }>`
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: ${p => p.$active ? 700 : 500};
  color: ${p => p.$active ? ROLE_COLOR[p.$role] || 'var(--accent-gold)' : 'var(--text-secondary)'};
  background: none;
  border: none;
  border-bottom: 2px solid ${p => p.$active ? ROLE_COLOR[p.$role] || 'var(--accent-gold)' : 'transparent'};
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--transition-fast), border-color var(--transition-fast);

  &:hover {
    color: ${p => ROLE_COLOR[p.$role] || 'var(--accent-gold)'};
  }
`;

interface Props {
  jobs: string[];
  selected: string;
  onSelect: (job: string) => void;
}

export default function JobTabs({ jobs, selected, onSelect }: Props) {
  return (
    <TabBar>
      {jobs.map(job => {
        const role = JOB_ROLES[job] || 'dps';
        return (
          <Tab
            key={job}
            $active={job === selected}
            $role={role}
            onClick={() => onSelect(job)}
          >
            {job}
          </Tab>
        );
      })}
    </TabBar>
  );
}
