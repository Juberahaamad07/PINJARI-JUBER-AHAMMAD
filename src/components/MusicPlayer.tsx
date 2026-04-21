import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SYNTHETIC_DREAMS_v0.1',
    artist: 'NEURAL_LINK',
    url: '',
    duration: 180,
    cover: 'https://picsum.photos/seed/cyber1/200/200'
  },
  {
    id: '2',
    title: 'VOID_FREQUENCIES',
    artist: 'QUANTUM_GHOST',
    url: '',
    duration: 215,
    cover: 'https://picsum.photos/seed/cyber2/200/200'
  },
  {
    id: '3',
    title: 'DATA_STREAM_ERROR',
    artist: 'BIT_CRUSHER',
    url: '',
    duration: 145,
    cover: 'https://picsum.photos/seed/cyber3/200/200'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black/40 border-2 border-magenta p-6 relative overflow-hidden backdrop-blur-md">
      {/* Glitch overlays */}
      <div className="absolute top-0 left-0 w-full h-1 bg-magenta/20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1 h-full bg-cyan/20 animate-pulse"></div>

      <div className="flex items-center space-x-6">
        <div className="relative w-24 h-24 flex-shrink-0 group">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover border border-cyan/50"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex space-x-1 items-end h-8">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 30, 15, 35, 10] }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                    className="w-1 bg-cyan shadow-[0_0_8px_var(--cyan)]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-cyan truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-sm text-magenta/80 font-mono tracking-tighter">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 space-y-2">
        <div className="h-1 bg-white/10 w-full relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-magenta shadow-[0_0_10px_var(--magenta)]"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/50 lowercase tracking-widest">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center space-x-8">
        <button
          onClick={handlePrev}
          className="p-2 text-magenta hover:text-cyan transition-colors"
          title="PREV_TRACK"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={handleTogglePlay}
          className="w-14 h-14 rounded-full border-2 border-cyan flex items-center justify-center text-cyan hover:bg-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          title={isPlaying ? "HALT_STREAM" : "INITIALIZE_STREAM"}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>

        <button
          onClick={handleNext}
          className="p-2 text-magenta hover:text-cyan transition-colors"
          title="NEXT_TRACK"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-cyan/40 uppercase tracking-[0.2em]">
        <span>STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</span>
        <div className="flex items-center space-x-2">
            <Volume2 size={12} />
            <span>BITRATE: 128KBPS</span>
        </div>
      </div>
    </div>
  );
}
