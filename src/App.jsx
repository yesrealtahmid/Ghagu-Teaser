import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeDown, FaExpand, FaBackward, FaForward } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Initialize volume at 50%
  const [currentTime, setCurrentTime] = useState(0); // Track current time
  const [duration, setDuration] = useState(0); // Track total video duration
  const [progress, setProgress] = useState(0); // Track video progress (in percentage)
  const [isDragging, setIsDragging] = useState(false); // Track if user is dragging the progress bar

  const progressBarRef = useRef(null);

  // Player ready callback
  const onPlayerReady = (event) => {
    const playerInstance = event.target;
    setPlayer(playerInstance); // Save the player instance
    playerInstance.setVolume(volume); // Set initial volume
    setDuration(playerInstance.getDuration()); // Set video duration once ready
  };

  // Player state change callback
  const onPlayerStateChange = (event) => {
    const YT = window.YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  // Player control functions
  const playVideo = () => player && player.playVideo();
  const pauseVideo = () => player && player.pauseVideo();
  const stopVideo = () => player && player.stopVideo();

  // Volume control functions
  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    if (player) {
      player.setVolume(newVolume);
    }
    setVolume(newVolume);
  };

  // Update the video progress periodically
  useEffect(() => {
    let interval;
    if (isPlaying && player) {
      interval = setInterval(() => {
        const current = player.getCurrentTime();
        setCurrentTime(current);
        setProgress((current / duration) * 100); // Update progress in percentage
      }, 100); // Update every 100ms
    }

    return () => clearInterval(interval); // Clean up the interval when component unmounts or video stops
  }, [isPlaying, player, duration]);

  // Handle video progress bar click to seek
  const handleSeek = (event) => {
    const progressBarWidth = progressBarRef.current.offsetWidth;
    const clickPosition = event.nativeEvent.offsetX;
    const newTime = (clickPosition / progressBarWidth) * duration;
    if (player) {
      player.seekTo(newTime, true);
    }
    setProgress((clickPosition / progressBarWidth) * 100);
  };

  // Start dragging
  const startDrag = (event) => {
    setIsDragging(true);
    handleSeek(event); // Handle initial click position immediately
  };

  // During dragging (mousemove)
  const duringDrag = (event) => {
    if (isDragging) {
      handleSeek(event);
    }
  };

  // Stop dragging
  const stopDrag = () => {
    setIsDragging(false);
  };

  // Skip forward by 2 seconds
  const skipForward = () => {
    if (player) {
      const newTime = player.getCurrentTime() + 2; // Add 2 seconds
      if (newTime < duration) {
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
        setProgress((newTime / duration) * 100); // Update progress
      }
    }
  };

  // Skip backward by 2 seconds
  const skipBackward = () => {
    if (player) {
      const newTime = player.getCurrentTime() - 2; // Subtract 2 seconds
      if (newTime > 0) {
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
        setProgress((newTime / duration) * 100); // Update progress
      }
    }
  };

  // Fullscreen function


  const videoOptions = {
    height: '720',
    width: '1280',
    playerVars: {
      autoplay: 0, // Disable autoplay
      controls: 0, // Hide default controls
    },
  };

  return (
    <div className="app-container">
      {/* YouTube player */}
      <YouTube
        videoId="Kbt_FPfeZNE" // YouTube video ID
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
          style={{ width: `${progress}%` }}  // This controls how much of the progress bar is filled
        />
        {/* Circle at current progress */}
        <div
          className="progress-thumb"
          style={{
            left: `${progress}%`, // Position the thumb based on progress
            transform: 'translateX(-50%)', // Offset the thumb to be centered
          }}
        />
      </div>

      {/* Custom video controls */}
      <div className="controls-container">
        {/* Play/Pause button */}
        <div className='buttons'>
          <button
            className="control-button"
            onClick={isPlaying ? pauseVideo : playVideo}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="control-button" onClick={stopVideo}>
            <FaStop />
          </button>
          <button className="control-button" onClick={skipBackward}>
            <FaBackward />
          </button>
          <button className="control-button" onClick={skipForward}>
            <FaForward />
          </button>
        </div>






        {/* Volume control */}
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        {/* Video progress bar */}

      </div>
    </div>
  );
};

export default App;
