import React from 'react';
import { SlideLayout, FlexBox, Box } from 'spectacle';

interface SectionNavigationProps {
  type: 'start' | 'end';
  currentSection: string;
  previousSection?: {
    name: string;
    url: string;
  };
  nextSection?: {
    name: string;
    url: string;
  };
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({
  type,
  currentSection,
  previousSection,
  nextSection
}) => {
  if (type === 'start' && previousSection) {
    return (
      <SlideLayout.Full>
        <FlexBox alignItems="center" justifyContent="space-between" flexDirection="row" width="100%">
          <Box>
            <a 
              href={previousSection.url}
              style={{
                color: '#61dafb',
                textDecoration: 'none',
                fontSize: '24px',
                padding: '10px 20px',
                border: '2px solid #61dafb',
                borderRadius: '8px',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#61dafb';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#61dafb';
              }}
            >
              ← {previousSection.name}
            </a>
          </Box>
          <Box textAlign="center">
            <h1 style={{ margin: 0, fontSize: '48px' }}>{currentSection}</h1>
            <p style={{ margin: '10px 0 0 0', fontSize: '20px', opacity: 0.7 }}>
              Use arrow keys to navigate slides
            </p>
            <a 
              href="./"
              style={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '16px',
                marginTop: '10px',
                display: 'inline-block'
              }}
            >
              ← Back to all sections
            </a>
          </Box>
          <Box width="200px" />
        </FlexBox>
      </SlideLayout.Full>
    );
  }

  if (type === 'end' && nextSection) {
    return (
      <SlideLayout.Full>
        <FlexBox alignItems="center" justifyContent="space-between" flexDirection="row" width="100%">
          <Box width="200px" />
          <Box textAlign="center">
            <h1 style={{ margin: 0, fontSize: '48px' }}>End of {currentSection}</h1>
            <p style={{ margin: '10px 0 0 0', fontSize: '20px', opacity: 0.7 }}>
              Ready for the next section?
            </p>
          </Box>
          <Box>
            <a 
              href={nextSection.url}
              style={{
                color: '#61dafb',
                textDecoration: 'none',
                fontSize: '24px',
                padding: '10px 20px',
                border: '2px solid #61dafb',
                borderRadius: '8px',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#61dafb';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#61dafb';
              }}
            >
              {nextSection.name} →
            </a>
          </Box>
        </FlexBox>
      </SlideLayout.Full>
    );
  }

  // Default case - just show the section title
  return (
    <SlideLayout.Full>
      <h1 style={{ margin: 0, fontSize: '48px' }}>{currentSection}</h1>
      <p style={{ margin: '10px 0 0 0', fontSize: '20px', opacity: 0.7 }}>
        Use arrow keys to navigate slides
      </p>
    </SlideLayout.Full>
  );
};

export default SectionNavigation;