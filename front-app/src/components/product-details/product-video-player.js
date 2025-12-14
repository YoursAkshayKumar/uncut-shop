'use client';
import React, { useState } from "react";

const ProductVideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl) {
    return null;
  }

  // Check if it's a YouTube URL
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  // Check if it's a Vimeo URL
  const isVimeo = videoUrl.includes('vimeo.com');
  // Check if it's a direct video URL
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url) => {
    const regExp = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Render YouTube embed
  if (isYouTube) {
    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      return (
        <div className="product__video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            title="Product video"
          />
        </div>
      );
    }
  }

  // Render Vimeo embed
  if (isVimeo) {
    const videoId = getVimeoId(videoUrl);
    if (videoId) {
      return (
        <div className="product__video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            title="Product video"
          />
        </div>
      );
    }
  }

  // Render direct video
  if (isDirectVideo) {
    return (
      <div className="product__video-wrapper">
        <video
          controls
          style={{
            width: '100%',
            maxHeight: '575px',
            objectFit: 'cover',
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Fallback for unrecognized URLs
  return (
    <div className="product__video-wrapper">
      <div className="alert alert-warning">
        <p>Video URL format not recognized. Please use YouTube, Vimeo, or direct video links.</p>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
          Open Video
        </a>
      </div>
    </div>
  );
};

export default ProductVideoPlayer;
