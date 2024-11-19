import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import './App.css';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progressBarRef = useRef(null);

  const onPlayerReady = (event) => {
    const playerInstance = event.target;
    setPlayer(playerInstance);
    setDuration(playerInstance.getDuration());
    playerInstance.playVideo();  // Play the video immediately
    playerInstance.unMute();  // Unmute the video after it starts
  };

  const onPlayerStateChange = (event) => {
    const YT = window.YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying && player) {
      interval = setInterval(() => {
        const current = player.getCurrentTime();
        setCurrentTime(current);
        setProgress((current / duration) * 100);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, player, duration]);

  const handleSeek = (event) => {
    const progressBarWidth = progressBarRef.current.offsetWidth;
    const clickPosition = event.nativeEvent.offsetX;
    const newTime = (clickPosition / progressBarWidth) * duration;
    if (player) {
      player.seekTo(newTime, true);
    }
    setProgress((clickPosition / progressBarWidth) * 100);
  };

  const startDrag = (event) => {
    setIsDragging(true);
    handleSeek(event);
  };

  const duringDrag = (event) => {
    if (isDragging) {
      handleSeek(event);
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const videoOptions = {
    height: '720',
    width: '1280',
    playerVars: {
      autoplay: 1,  // Autoplay the video
      controls: 0,  // Hide YouTube controls
      mute: 1,      // Start muted (required for autoplay)
    },
  };

  return (
    <div className="app-container">
      <div className='youtube-and-progress'>
        <YouTube
          videoId="Kbt_FPfeZNE"
          opts={videoOptions}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          className="youtube-player"
        />
        <div
          className="progress-bar-container"
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseDown={startDrag}
          onMouseMove={duringDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
          <div
            className="progress-thumb"
            style={{
              left: `${progress}%`,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
