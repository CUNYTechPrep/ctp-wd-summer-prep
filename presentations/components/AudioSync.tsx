import React, { useEffect, useRef, useState, useContext } from 'react';
import { DeckContext } from 'spectacle';

interface AudioSyncProps {
  audioUrl: string;
  // Array of time indices (in seconds) for each slide
  // e.g., [0, 15, 30, 45] means slide 0 at 0s, slide 1 at 15s, etc.
  slideTimings: number[];
  onPlayStateChange?: (isPlaying: boolean) => void;
  transcript?: string; // URL to SRT file
}

export function AudioSync({ audioUrl, slideTimings, onPlayStateChange, transcript }: AudioSyncProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const deckContext = useContext(DeckContext);
  const lastSlideIndexRef = useRef<number>(-1);
  const isUserNavigatingRef = useRef(false);

  if (!deckContext) {
    return null;
  }

  const { slideCount, activeView, skipTo } = deckContext;
  const currentSlide = activeView?.slideIndex ?? 0;

  // Enable subtitles when transcript is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !transcript) return;

    console.log('Attempting to load subtitles from:', transcript);
    
    // Test if VTT file is accessible
    fetch(transcript)
      .then(response => {
        console.log('VTT fetch response:', response.status, response.statusText);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        console.log('VTT content preview:', text.substring(0, 200));
      })
      .catch(error => {
        console.error('Failed to fetch VTT file:', error);
      });

    // Debug function to check subtitle status
    const checkSubtitles = () => {
      const tracks = video.textTracks;
      console.log('Text tracks available:', tracks.length);
      
      if (tracks && tracks.length > 0) {
        const track = tracks[0];
        console.log('Track state:', {
          mode: track.mode,
          kind: track.kind,
          label: track.label,
          language: track.language,
          cues: track.cues?.length || 0
        });
        
        // Force showing
        track.mode = 'showing';
      }
    };

    // Listen for various events
    const handleLoadStart = () => console.log('Track load started');
    const handleLoad = () => {
      console.log('Track loaded');
      checkSubtitles();
    };
    const handleError = (e: Event) => console.error('Track error:', e);

    // Try multiple approaches
    video.addEventListener('loadedmetadata', checkSubtitles);
    
    const trackElement = video.querySelector('track');
    if (trackElement) {
      trackElement.addEventListener('load', handleLoad);
      trackElement.addEventListener('error', handleError);
      trackElement.addEventListener('loadstart', handleLoadStart);
    }

    // Check after a delay
    setTimeout(checkSubtitles, 1000);

    return () => {
      video.removeEventListener('loadedmetadata', checkSubtitles);
      if (trackElement) {
        trackElement.removeEventListener('load', handleLoad);
        trackElement.removeEventListener('error', handleError);
        trackElement.removeEventListener('loadstart', handleLoadStart);
      }
    };
  }, [transcript, videoRef.current]);

  // Handle time updates from audio
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);

      // Don't auto-navigate if user is manually navigating
      if (isUserNavigatingRef.current) return;

      // Find which slide we should be on based on current time
      let targetSlide = 0;
      for (let i = slideTimings.length - 1; i >= 0; i--) {
        if (time >= slideTimings[i]) {
          targetSlide = i;
          break;
        }
      }

      // Navigate to the target slide if different from current
      if (targetSlide !== currentSlide && targetSlide < slideCount) {
        skipTo({ slideIndex: targetSlide, stepIndex: 0 });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      let errorMessage = 'Failed to load audio';
      
      if (video.error) {
        switch (video.error.code) {
          case video.error.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted';
            break;
          case video.error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case video.error.MEDIA_ERR_DECODE:
            errorMessage = 'Audio format not supported';
            break;
          case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio source not supported or not found';
            break;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      console.error('Audio loading error:', errorMessage, audioUrl);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentSlide, slideCount, slideTimings, skipTo, onPlayStateChange]);

  // Handle slide changes - sync audio to slide
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if slide changed due to user navigation
    if (currentSlide !== lastSlideIndexRef.current) {
      lastSlideIndexRef.current = currentSlide;
      
      // Mark that user is navigating
      isUserNavigatingRef.current = true;
      
      // Jump audio to the corresponding time
      if (currentSlide < slideTimings.length) {
        const targetTime = slideTimings[currentSlide];
        
        // Pause briefly to prevent audio overlap
        const wasPlaying = !video.paused;
        video.pause();
        
        // Set the new time
        video.currentTime = targetTime;
        
        // Resume playing if it was playing before
        if (wasPlaying) {
          // Small delay to ensure smooth transition
          setTimeout(() => {
            video.play().catch(() => {
              // Ignore autoplay errors
            });
          }, 50);
        }
      }
      
      // Clear user navigation flag after a delay
      setTimeout(() => {
        isUserNavigatingRef.current = false;
      }, 500);
    }
  }, [currentSlide, slideTimings]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    
    // Pause briefly to prevent audio overlap during seeking
    const wasPlaying = !video.paused;
    video.pause();
    
    video.currentTime = newTime;
    setCurrentTime(newTime);

    // Find which slide corresponds to the scrubbed time
    let targetSlide = 0;
    for (let i = slideTimings.length - 1; i >= 0; i--) {
      if (newTime >= slideTimings[i]) {
        targetSlide = i;
        break;
      }
    }

    // Navigate to the target slide if different from current
    if (targetSlide !== currentSlide && targetSlide < slideCount) {
      isUserNavigatingRef.current = true;
      skipTo({ slideIndex: targetSlide, stepIndex: 0 });
      
      // Clear user navigation flag after a delay
      setTimeout(() => {
        isUserNavigatingRef.current = false;
      }, 500);
    }
    
    // Resume playing if it was playing before (after a small delay)
    if (wasPlaying) {
      setTimeout(() => {
        video.play().catch(() => {
          // Ignore autoplay errors
        });
      }, 50);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 10000,
      pointerEvents: 'auto',
      background: 'rgba(0, 0, 0, 0)',
      borderRadius: '10px',
      minWidth: '400px'
    }}>
      {/* Video container with play button */}
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'stretch'
      }}>
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            padding: '0 15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            minWidth: '50px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : (isPlaying ? '⏸️' : '▶️')}
        </button>
        
        {/* Video element with native controls */}
        <div style={{
          position: 'relative',
          flex: 1,
          height: '8rem',
          overflow: 'hidden',
          borderRadius: '8px',
          background: 'black'
        }}>
        <video
          ref={videoRef} 
          src={audioUrl}
          controls
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: '400px',
            position: 'absolute',
            bottom: 0,
            left: 0,
            objectFit: 'contain'
          }}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
        >
        {transcript && (
          <track
            kind="subtitles"
            src={transcript}
            srcLang="en"
            label="English"
            default
            onLoad={() => console.log('Track loaded successfully')}
            onError={(e) => console.error('Track failed to load:', e)}
          />
        )}
        </video>
        </div>
      </div>
      
      {error && (
        <div style={{
          color: '#ff6b6b',
          fontSize: '12px',
          marginTop: '5px'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}