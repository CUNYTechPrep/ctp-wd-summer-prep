import React, { lazy, Suspense, useState, PropsWithChildren, useContext, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import {
  CodeSpan,
  Deck,
  DefaultTemplate,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  CodePane,
  DeckContext
} from 'spectacle';
import { CodeDisplayContext } from './components/CodeDisplayContext';
import CodeDisplay, { Version, File, Tests } from './components/CodeDisplayWithSlideTracking';
import { ThemeProvider } from './components/ThemeContext';
import { AudioSync } from './components/AudioSync';
import './styles.css';
import { createPortal } from 'react-dom';

// Audio configuration type
interface AudioConfig {
  url: string;
  slideTimings: number[];
  transcript?: string; // Optional URL to SRT file
}

// Presentation type
interface PresentationConfig {
  title: string;
  component: React.LazyExoticComponent<any>;
  audio?: AudioConfig;
}

// Define presentation metadata
const presentations: Record<string, Record<string, PresentationConfig>> = {
  js: {
    'fullstack-introduction': {
      title: 'Fullstack Introduction',
      component: lazy(() => import('./js-intro-sections/fullstack-introduction/index.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/fullstack-introduction.mp4',
        slideTimings: [0, 35, 100, 154, 217, 262, 302, 398, 521, 610, 667, 717, 746],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/fullstack-introduction_otter_ai.vtt',
      },
    },
    'html-basics': {
      title: 'HTML Basics',
      component: lazy(() => import('./js-intro-sections/html-basics.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/html-basics.mp3',
        slideTimings: [0, 38, 120, 210, 292, 356, 429, 492, 514],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/html-basics.vtt'
      }
    },
    'css-fundamentals': { title: 'CSS Fundamentals', component: lazy(() => import('./js-intro-sections/css-fundamentals.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/css-fundementals.mp3',
        slideTimings: [0, 32, 120, 191, 273, 350, 423, 508, 562, 616, 672, 726, 780, 836, 852, 869, 952],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/css-fundementals.vtt'
      }
    },
    'introduction': { title: 'Introduction to JavaScript', component: lazy(() => import('./js-intro-sections/introduction.mdx')) },
    'variables-and-types': {
      title: 'Variables and Types',
      component: lazy(() => import('./js-intro-sections/variables-and-types.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/variables-and-types.mp4',
        slideTimings: [0, 23, 73, 145, 211, 274, 358, 380, 456, 522, 620, 720, 814, 910, 980, 1066, 1124, 1162, 1236, 1306, 1376, 1448],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/variables-and-types_otter_ai.vtt'
      }
    },
    'functions': {
      title: 'Functions',
      component: lazy(() => import('./js-intro-sections/functions.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/functions.mp4',
        slideTimings: [0, 34, 88, 180, 260, 348, 444, 540, 716, 813, 908, 999, 1080, 1260, 1332, 1428, 1516],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/functions.vtt',
      }
    },
    'control-flow': { 
      title: 'Control Flow', 
      component: lazy(() => import('./js-intro-sections/control-flow.mdx')),
      audio: {
        url: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/control-flow.mp4',
        slideTimings: [40, 112, 168, 230, 296, 376, 418, 450, 536, 610, 680, 788, 846, 922, 986, 1080, 1140, 1172, 1270, 1328, 1408, 1508, 1595, 1672. 1776, ],
        transcript: 'https://ctp-presentation-media.s3.us-east-2.amazonaws.com/control-flow.vtt'
      }
    },
    'objects-and-arrays': { title: 'Objects and Arrays', component: lazy(() => import('./js-intro-sections/objects-and-arrays.mdx')) },
    'dom-manipulation': { title: 'DOM Manipulation', component: lazy(() => import('./js-intro-sections/dom-manipulation.mdx')) },
    'async-javascript': { title: 'Async JavaScript', component: lazy(() => import('./js-intro-sections/async-javascript.mdx')) },
    'error-handling': { title: 'Error Handling', component: lazy(() => import('./js-intro-sections/error-handling.mdx')) },
    'advanced-functions': {
      title: 'Advanced Functions',
      component: lazy(() => import('./js-intro-sections/advanced-functions.mdx')),
      // Example audio configuration - replace with actual audio file URL
      audio: {
        url: '/audio/advanced-functions.mp3',
        // 21 slides total (0-20), with 30 seconds per slide as an example
        slideTimings: [
          0,    // 00-overview
          30,   // 01-advanced-functions
          60,   // 02-closures-concept
          90,   // 03-how-closures-work
          120,  // 04-data-privacy
          150,  // 05-stateful-functions
          180,  // 06-factory-pattern
          210,  // 07-event-handlers
          240,  // 08-closure-patterns
          270,  // 09-habit-tracker-exercise
          300,  // 10-higher-order-patterns
          330,  // 11-function-enhancement
          360,  // 12-points-calculator-exercise
          390,  // 13-function-composition
          420,  // 14-higher-order-examples
          450,  // 15-pure-functions
          480,  // 16-immutability
          510,  // 17-fp-composition
          540,  // 18-closure-pitfalls
          570,  // 19-debugging
          600   // 20-key-takeaways
        ]
      }
    },
    'prototypes': { title: 'Prototypes', component: lazy(() => import('./js-intro-sections/prototypes.mdx')) },
    'modules': { title: 'Modules', component: lazy(() => import('./js-intro-sections/modules.mdx')) },
    'modern-features': { title: 'Modern Features', component: lazy(() => import('./js-intro-sections/modern-features.mdx')) },
    'common-pitfalls': { title: 'Common Pitfalls', component: lazy(() => import('./js-intro-sections/common-pitfalls.mdx')) },
    'best-practices': { title: 'Best Practices', component: lazy(() => import('./js-intro-sections/best-practices.mdx')) },
  },
  ts: {
    'introduction': { title: 'Introduction to TypeScript', component: lazy(() => import('./ts-intro-sections/introduction.mdx')) },
    'type-problems': { title: 'Type Problems', component: lazy(() => import('./ts-intro-sections/type-problems.mdx')) },
    'type-basics': { title: 'Type Basics', component: lazy(() => import('./ts-intro-sections/type-basics.mdx')) },
    'interfaces-and-types': { title: 'Interfaces and Types', component: lazy(() => import('./ts-intro-sections/interfaces-and-types.mdx')) },
    'unions-and-literals': { title: 'Unions and Literals', component: lazy(() => import('./ts-intro-sections/unions-and-literals.mdx')) },
    'generics': { title: 'Generics', component: lazy(() => import('./ts-intro-sections/generics.mdx')) },
    'type-guards': { title: 'Type Guards', component: lazy(() => import('./ts-intro-sections/type-guards.mdx')) },
    'utility-types': { title: 'Utility Types', component: lazy(() => import('./ts-intro-sections/utility-types.mdx')) },
    'classes-and-oop': { title: 'Classes and OOP', component: lazy(() => import('./ts-intro-sections/classes-and-oop.mdx')) },
    'modules-and-namespaces': { title: 'Modules and Namespaces', component: lazy(() => import('./ts-intro-sections/modules-and-namespaces.mdx')) },
    'async-types': { title: 'Async Types', component: lazy(() => import('./ts-intro-sections/async-types.mdx')) },
    'common-patterns': { title: 'Common Patterns', component: lazy(() => import('./ts-intro-sections/common-patterns.mdx')) },
    'react-typescript': { title: 'React with TypeScript', component: lazy(() => import('./ts-intro-sections/react-typescript.mdx')) },
    'testing-typescript': { title: 'Testing TypeScript', component: lazy(() => import('./ts-intro-sections/testing-typescript.mdx')) },
    'migration-strategies': { title: 'Migration Strategies', component: lazy(() => import('./ts-intro-sections/migration-strategies.mdx')) },
    'ecosystem-and-tools': { title: 'Ecosystem and Tools', component: lazy(() => import('./ts-intro-sections/ecosystem-and-tools.mdx')) },
  },
  react: {
    'introduction': { title: 'Introduction to React', component: lazy(() => import('./react-sections/introduction.mdx')) },
    'components-props': { title: 'Components and Props', component: lazy(() => import('./react-sections/components-props/00-overview.mdx')) },
    'state-hooks': { title: 'State and Hooks', component: lazy(() => import('./react-sections/state-hooks/00-overview.mdx')) },
    'events-and-forms': { title: 'Events and Forms', component: lazy(() => import('./react-sections/events-and-forms/00-overview.mdx')) },
    'conditional-rendering': { title: 'Conditional Rendering', component: lazy(() => import('./react-sections/conditional-rendering/01-introduction.mdx')) },
    'lists-and-keys': { title: 'Lists and Keys', component: lazy(() => import('./react-sections/lists-and-keys/01-introduction.mdx')) },
    'lifecycle-methods': { title: 'Lifecycle Methods', component: lazy(() => import('./react-sections/lifecycle-methods.mdx')) },
    'refs-and-dom': { title: 'Refs and DOM Access', component: lazy(() => import('./react-sections/refs-and-dom.mdx')) },
    'context-api': { title: 'Context API', component: lazy(() => import('./react-sections/context-api/01-introduction.mdx')) },
    'custom-hooks': { title: 'Custom Hooks', component: lazy(() => import('./react-sections/custom-hooks/01-introduction.mdx')) },
    'advanced-patterns': { title: 'Advanced Patterns', component: lazy(() => import('./react-sections/advanced-patterns.mdx')) },
    'portals': { title: 'Portals', component: lazy(() => import('./react-sections/portals.mdx')) },
    'suspense-and-boundaries': { title: 'Suspense & Error Boundaries', component: lazy(() => import('./react-sections/suspense-and-boundaries.mdx')) },
    'performance-optimization': { title: 'Performance Optimization', component: lazy(() => import('./react-sections/performance-optimization/01-introduction.mdx')) },
    'data-fetching': { title: 'Data Fetching', component: lazy(() => import('./react-sections/data-fetching/00-overview.mdx')) },
    'server-components': { title: 'Server Components', component: lazy(() => import('./react-sections/server-components.mdx')) },
    'styling-approaches': { title: 'Styling Approaches', component: lazy(() => import('./react-sections/styling-approaches.mdx')) },
    'testing': { title: 'Testing React', component: lazy(() => import('./react-sections/testing.mdx')) },
  }
};

// Error Boundary Component (currently unused but may be needed for error handling)
// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean; error: Error | null }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="error">
//           <h2>Error loading presentation</h2>
//           <p>{this.state.error?.message}</p>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }


// Custom template that includes navigation tracking
function CustomTemplate({
  activePresentation,
  onSlideInfo,
  getNextPresentation,
  getPreviousPresentation,
  audioDrawerOpen,
  setAudioDrawerOpen,
}: {
  activePresentation: { category: 'js' | 'ts' | 'react'; key: string } | null;
  onSlideInfo: (info: any) => void;
  getNextPresentation: () => { category: 'js' | 'ts' | 'react'; key: string } | null;
  getPreviousPresentation: () => { category: 'js' | 'ts' | 'react'; key: string } | null;
  audioDrawerOpen: boolean;
  setAudioDrawerOpen: (open: boolean) => void;
}) {
  const deckContext = useContext(DeckContext);

  useEffect(() => {
    if (deckContext) {
      const { slideCount, activeView } = deckContext;
      const slideIndex = activeView?.slideIndex ?? 0;

      const info = {
        current: slideIndex,
        total: slideCount,
        isLast: slideIndex === slideCount - 1
      };

      onSlideInfo(info);
    }
  }, [deckContext, onSlideInfo]);

  if (!deckContext) return <DefaultTemplate />;

  const { slideCount, activeView } = deckContext;
  const slideIndex = activeView?.slideIndex ?? 0;
  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === slideCount - 1;

  return (
    <>
      <DefaultTemplate />
      {/* First slide indicator */}
      {activePresentation && isFirstSlide && (() => {
        const prev = getPreviousPresentation();
        if (prev && presentations[prev.category] && prev.key in presentations[prev.category]) {
          const prevTitle = presentations[prev.category][prev.key as keyof typeof presentations[typeof prev.category]].title;
          // Check if we're in presenter mode
          const search = window.location.search;
          const inPresenterMode = search.includes('presenterMode');
          return (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '8px',
              fontSize: '14px',
              zIndex: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                color: prev.category === 'js' ? '#f7df1e' : '#3178c6',
                fontWeight: 'bold'
              }}>
                {prevTitle}
              </span>
              <span>← Press to go back</span>
              {inPresenterMode && (
                <span style={{
                  background: '#4CAF50',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  PRESENTER
                </span>
              )}
            </div>
          );
        }
        return null;
      })()}
      {(() => {
        if (!activePresentation) return null;

        const presentationConfig = presentations[activePresentation.category as 'js' | 'ts' | 'react'][activePresentation.key as keyof typeof presentations[typeof activePresentation.category]];
        const audio = presentationConfig.audio as { url: string; slideTimings: number[] } | undefined;
        if (audio) {
          return (
            createPortal(<>
              {/* Toggle Button - Always visible */}
              <button
                onClick={() => setAudioDrawerOpen(!audioDrawerOpen)}
                style={{
                  position: 'fixed',
                  bottom: '30px',
                  right: audioDrawerOpen ? '470px' : '20px',
                  width: '50px',
                  height: '50px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white',
                  zIndex: 2001,
                  transition: 'right 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
                title={audioDrawerOpen ? 'Hide Audio Controls' : 'Show Audio Controls'}
              >
                {audioDrawerOpen ? '🎵' : '▶️'}
              </button>

              {/* Audio Drawer */}
              <div style={{
                position: 'fixed',
                bottom: '20px',
                right: audioDrawerOpen ? '20px' : '-450px',
                transition: 'right 0.3s ease',
                zIndex: 2000,
                pointerEvents: 'auto',
                width: '450px',
              }}>
                <AudioSync
                  audioUrl={audio.url}
                  slideTimings={audio.slideTimings}
                  transcript={audio.transcript}
                />
              </div>
            </>, document.body)
            );
        } else {
          return null
        }
      })()}
      {/* Last slide indicator */}
      {activePresentation && isLastSlide && (() => {
        const next = getNextPresentation();
        if (next && presentations[next.category] && next.key in presentations[next.category]) {
          const nextTitle = presentations[next.category][next.key as keyof typeof presentations[typeof next.category]].title;
          return (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '8px',
              fontSize: '14px',
              zIndex: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>Press → to continue</span>
              <span style={{
                color: next.category === 'js' ? '#f7df1e' : '#3178c6',
                fontWeight: 'bold'
              }}>
                {nextTitle}
              </span>
            </div>
          );
        }
        return null;
      })()}

    </>
  );
}

// Main App Component
function App() {
  // Parse URL path to get initial presentation
  const getInitialPresentation = () => {
    // Parse path like /js/advanced-functions or /react/components-props
    const pathname = window.location.pathname;
    // Remove base path if present
    const basePath = import.meta.env.BASE_URL;
    const adjustedPath = pathname.startsWith(basePath) 
      ? pathname.slice(basePath.length) 
      : pathname;
    const pathSegments = adjustedPath.split('/').filter(Boolean);

    // Expected format: /category/presentation
    if (pathSegments.length >= 2) {
      const [category, ...presentationParts] = pathSegments;
      const key = presentationParts.join('-'); // Handle cases like 'components-props'

      if ((category === 'js' || category === 'ts' || category === 'react') &&
        presentations[category] &&
        key in presentations[category]) {

        // Check if we have a slide number in the hash
        const hash = window.location.hash;
        const slideMatch = hash.match(/#\/(\d+)(\?.*)?/);
        if (slideMatch) {
          // Store the initial slide position
          sessionStorage.setItem('initialSlide', slideMatch[1]);
        }

        return { category: category as 'js' | 'ts' | 'react', key };
      }
    }

    return null;
  };

  const [activePresentation, setActivePresentation] = useState<{
    category: 'js' | 'ts' | 'react';
    key: string;
  } | null>(getInitialPresentation());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [audioDrawerOpen, setAudioDrawerOpen] = useState(false);
  const slideInfoRef = useRef({ current: 0, total: 0, isLast: false });


  // Update URL when presentation changes (but preserve hash and Spectacle params)
  useEffect(() => {
    if (!activePresentation) return;

    const updateUrl = () => {
      // Build the expected path
      const basePath = import.meta.env.BASE_URL;
      const expectedPath = `${basePath}${basePath.endsWith('/') ? '' : '/'}${activePresentation.category}/${activePresentation.key}`;

      // Only update if we're not already on the correct path
      if (window.location.pathname !== expectedPath) {
        const newUrl = `${expectedPath}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
      }
    };

    // Initial update
    updateUrl();

    // Listen for hash changes to ensure path stays correct
    const handleHashChange = () => {
      updateUrl();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activePresentation]);

  const handlePresentationSelect = (category: 'js' | 'ts' | 'react', key: string, goToLastSlide = false, isArrowNavigation = false) => {
    // Check if we're selecting the same presentation (just opening menu)
    const isSamePresentation = activePresentation?.category === category && activePresentation?.key === key;

    if (isSamePresentation) {
      setSidebarOpen(false);
      return;
    }

    // Parse current hash to preserve Spectacle params
    const currentHash = window.location.hash;
    let spectacleParams = '';

    if (currentHash) {
      const match = currentHash.match(/#\/(\d+)(\?.*)?/);
      if (match) {
        // Keep Spectacle params (like ?presenter)
        spectacleParams = match[2] || '';
      }
    }

    if (goToLastSlide) {
      // Store flag in sessionStorage to handle after deck loads
      sessionStorage.setItem('navigateToLastSlide', 'true');
    } else {
      sessionStorage.removeItem('navigateToLastSlide');
    }

    // For arrow navigation in presenter mode, we need to preserve the mode
    if (isArrowNavigation && spectacleParams) {
      // Store that we need to reopen presenter mode
      sessionStorage.setItem('reopenPresenterMode', 'true');

      // Store the slide we want to go to
      if (goToLastSlide) {
        sessionStorage.setItem('navigateToLastSlide', 'true');
      }
    }

    // Build path-based URL: /category/presentation
    const basePath = import.meta.env.BASE_URL;
    const newPath = `${basePath}${basePath.endsWith('/') ? '' : '/'}${category}/${key}`;

    // Determine slide number
    let slideNumber = '0';
    if (goToLastSlide) {
      // We'll handle this after load
      slideNumber = '0';
    }

    const newUrl = `${newPath}#/${slideNumber}${spectacleParams}`;

    // Navigate to the new URL
    window.location.href = newUrl;
  };

  // Handle slide info updates from NavigationTracker
  const handleSlideInfo = useCallback((info: { current: number; total: number; isLast: boolean }) => {
    slideInfoRef.current = info;

    // Save current slide position to sessionStorage
    if (activePresentation) {
      const storageKey = `slide-position-${activePresentation.category}-${activePresentation.key}`;
      sessionStorage.setItem(storageKey, info.current.toString());
    }
  }, [activePresentation]);

  const ActiveComponent = activePresentation && activePresentation.key in presentations[activePresentation.category]
    ? presentations[activePresentation.category][activePresentation.key as keyof typeof presentations[typeof activePresentation.category]].component
    : null;

  // Handle navigation to last slide and presenter mode after deck loads
  useEffect(() => {
    if (!activePresentation) return;

    const reopenPresenter = sessionStorage.getItem('reopenPresenterMode') === 'true';
    const navigateToLast = sessionStorage.getItem('navigateToLastSlide') === 'true';

    if (reopenPresenter || navigateToLast) {
      // Remove the flags
      sessionStorage.removeItem('reopenPresenterMode');
      sessionStorage.removeItem('navigateToLastSlide');

      // Wait for deck to fully load
      let attempts = 0;
      const handlePostLoad = () => {
        // Try to find slide count from DOM
        const slideElements = document.querySelectorAll('[style*="transform: translateX"]');
        const slideCount = slideElements.length;

        if (slideCount > 0) {
          if (navigateToLast) {
            // Navigate to last slide
            const lastSlideIndex = slideCount - 1;
            window.location.hash = `#/${lastSlideIndex}${reopenPresenter ? '?presenter' : ''}`;
          } else if (reopenPresenter) {
            // Just reopen presenter mode on current slide
            const currentHash = window.location.hash;
            const match = currentHash.match(/#\/(\d+)/);
            const slideNumber = match ? match[1] : '0';
            window.location.hash = `#/${slideNumber}?presenter`;
          }
        } else if (attempts < 20) {
          // Keep trying for up to 4 seconds
          attempts++;
          setTimeout(handlePostLoad, 200);
        }
      };

      // Start checking after a delay to let deck render
      setTimeout(handlePostLoad, 500);
    }
  }, [activePresentation]);

  // Get next presentation
  const getNextPresentation = () => {
    if (!activePresentation) return null;

    const allPresentations = [
      ...Object.keys(presentations.js).map(key => ({ category: 'js' as const, key })),
      ...Object.keys(presentations.ts).map(key => ({ category: 'ts' as const, key })),
      ...Object.keys(presentations.react).map(key => ({ category: 'react' as const, key }))
    ];

    const currentIndex = allPresentations.findIndex(
      p => p.category === activePresentation.category && p.key === activePresentation.key
    );

    // Don't loop - return null if we're at the last presentation
    if (currentIndex === -1 || currentIndex === allPresentations.length - 1) {
      return null;
    }

    return allPresentations[currentIndex + 1];
  };

  // Get previous presentation
  const getPreviousPresentation = () => {
    if (!activePresentation) return null;

    const allPresentations = [
      ...Object.keys(presentations.js).map(key => ({ category: 'js' as const, key })),
      ...Object.keys(presentations.ts).map(key => ({ category: 'ts' as const, key })),
      ...Object.keys(presentations.react).map(key => ({ category: 'react' as const, key }))
    ];

    const currentIndex = allPresentations.findIndex(
      p => p.category === activePresentation.category && p.key === activePresentation.key
    );

    // Don't loop - return null if we're at the first presentation
    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }

    return allPresentations[currentIndex - 1];
  };

  // Handle navigation between presentations
  useEffect(() => {
    if (!activePresentation) return;

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const { current, isLast } = slideInfoRef.current;
      const isFirst = current === 0;

      if (e.key === 'ArrowRight' && isLast) {
        const next = getNextPresentation();
        if (next) {
          e.preventDefault();
          e.stopPropagation();
          // Pass true for isArrowNavigation to preserve presenter mode
          handlePresentationSelect(next.category, next.key, false, true);
        }
      } else if (e.key === 'ArrowLeft' && isFirst) {
        const prev = getPreviousPresentation();
        if (prev) {
          e.preventDefault();
          e.stopPropagation();
          // Pass true for isArrowNavigation to preserve presenter mode
          handlePresentationSelect(prev.category, prev.key, true, true);
        }
      }
    };

    // Listen for navigation with capture to intercept before Spectacle
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [activePresentation, handlePresentationSelect]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          width: '40px',
          height: '40px',
          background: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          padding: '8px',
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{
          width: '100%',
          height: '3px',
          background: 'white',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          transform: sidebarOpen ? 'rotate(45deg) translateY(7px)' : 'none'
        }}></span>
        <span style={{
          width: '100%',
          height: '3px',
          background: 'white',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          opacity: sidebarOpen ? 0 : 1
        }}></span>
        <span style={{
          width: '100%',
          height: '3px',
          background: 'white',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          transform: sidebarOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
        }}></span>
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sidebar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-320px',
          width: '300px',
          height: '100vh',
          background: '#1e1e1e',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
          transition: 'left 0.3s ease',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '80px 0 20px 0'
        }}
      >
        <div style={{ padding: '0 20px' }}>
          <button
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              background: !activePresentation ? '#3178c6' : 'transparent',
              color: !activePresentation ? 'white' : '#ccc',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setActivePresentation(null);
              setSidebarOpen(false);
              window.location.href = import.meta.env.BASE_URL;
            }}
          >
            🏠 Home
          </button>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{
              color: '#f7df1e',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              JavaScript
            </h3>
            {Object.entries(presentations.js).map(([key, { title }]) => (
              <button
                key={`js-${key}`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '5px',
                  background: activePresentation?.category === 'js' && activePresentation.key === key
                    ? '#f7df1e'
                    : 'transparent',
                  color: activePresentation?.category === 'js' && activePresentation.key === key
                    ? '#333'
                    : '#ccc',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!(activePresentation?.category === 'js' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'rgba(247, 223, 30, 0.1)';
                    e.currentTarget.style.borderColor = '#444';
                  }
                }}
                onMouseOut={(e) => {
                  if (!(activePresentation?.category === 'js' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
                onClick={() => handlePresentationSelect('js', key)}
              >
                {title}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{
              color: '#3178c6',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              TypeScript
            </h3>
            {Object.entries(presentations.ts).map(([key, { title }]) => (
              <button
                key={`ts-${key}`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '5px',
                  background: activePresentation?.category === 'ts' && activePresentation.key === key
                    ? '#3178c6'
                    : 'transparent',
                  color: activePresentation?.category === 'ts' && activePresentation.key === key
                    ? 'white'
                    : '#ccc',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!(activePresentation?.category === 'ts' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'rgba(49, 120, 198, 0.1)';
                    e.currentTarget.style.borderColor = '#444';
                  }
                }}
                onMouseOut={(e) => {
                  if (!(activePresentation?.category === 'ts' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
                onClick={() => handlePresentationSelect('ts', key)}
              >
                {title}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{
              color: '#61dafb',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              React
            </h3>
            {Object.entries(presentations.react).map(([key, { title }]) => (
              <button
                key={`react-${key}`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '5px',
                  background: activePresentation?.category === 'react' && activePresentation.key === key
                    ? '#61dafb'
                    : 'transparent',
                  color: activePresentation?.category === 'react' && activePresentation.key === key
                    ? '#333'
                    : '#ccc',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!(activePresentation?.category === 'react' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'rgba(97, 218, 251, 0.1)';
                    e.currentTarget.style.borderColor = '#444';
                  }
                }}
                onMouseOut={(e) => {
                  if (!(activePresentation?.category === 'react' && activePresentation.key === key)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
                onClick={() => handlePresentationSelect('react', key)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="presentation-container">
        {ActiveComponent && activePresentation ? (
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: '2rem',
              color: '#666'
            }}>
              Loading presentation...
            </div>
          }>
            <Deck
              key={`${activePresentation.category}-${activePresentation.key}`}
              backgroundImage="url(https://ctp-presentation-media.s3.us-east-2.amazonaws.com/bg.gif)"
              template={() => (
                <CustomTemplate
                  setAudioDrawerOpen={setAudioDrawerOpen}
                  audioDrawerOpen={audioDrawerOpen}
                  activePresentation={activePresentation}
                  onSlideInfo={handleSlideInfo}
                  getNextPresentation={getNextPresentation}
                  getPreviousPresentation={getPreviousPresentation}
                />
              )}
            >
              <ActiveComponent components={{
                // Map markdown elements to Spectacle components
                h1: ({ children }: PropsWithChildren) => <Heading fontSize="h1" style={{ paddingBottom: '5px', marginBottom: '5px' }}>{children}</Heading>,
                h2: ({ children }: PropsWithChildren) => <Heading fontSize="h2" style={{ paddingBottom: '5px', marginBottom: '5px' }}>{children}</Heading>,
                h3: ({ children }: PropsWithChildren) => <Heading fontSize="h3" style={{ paddingBottom: '5px', marginBottom: '5px' }}>{children}</Heading>,
                h4: ({ children }: PropsWithChildren) => <Heading fontSize="h4" style={{ paddingBottom: '5px', marginBottom: '5px' }}>{children}</Heading>,
                ul: UnorderedList,
                ol: OrderedList,
                li: ({ children }: PropsWithChildren) => <ListItem fontSize="20px" margin="0">{children}</ListItem>,
                p: ({ children }: PropsWithChildren) => <Text fontSize="20px" lineHeight="1.5" margin="0.5rem 0">{children}</Text>,
                code: (props: PropsWithChildren<{ className?: string }>) => {
                  if (useContext(CodeDisplayContext)) {
                    return (
                      <Version>
                        {props.children}
                      </Version>
                    );
                  }
                  if (props.className && typeof props.children === 'string') {
                    // Extract language from className (e.g., 'language-tsx' -> 'tsx')
                    let language = props.className.split('-')[1] || 'javascript';

                    // Map to CodePane supported languages
                    const languageMap: Record<string, string> = {
                      'tsx': 'typescript',
                      'ts': 'typescript',
                      'jsx': 'jsx',
                      'js': 'javascript'
                    };

                    language = languageMap[language] || language;

                    return (
                      <CodePane language={language}>
                        {props.children}
                      </CodePane>
                    );
                  } else {
                    return <CodeSpan style={{ color: '#fff', fontSize: '16px', backgroundColor: '#000', padding: '2px 4px', borderRadius: '4px' }}>{props.children}</CodeSpan>;
                  }
                },
                // Add CodeDisplay components
                CodeDisplay,
                File,
                Tests,
                Version
              }} />
            </Deck>
          </Suspense>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>CTP Presentations</h1>
            <p>Select a presentation from the navigation bar above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);