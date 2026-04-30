import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "NEON DREAMS",
    artist: "CYBER AI GEN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "SYNTHETIC_WAVES",
    artist: "BIT_PULSE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "VOID_RUNNER",
    artist: "AI_ORCHESTRA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("User interaction needed for play", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full bg-black border-4 border-neon-cyan p-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
           {/* Raw Pixel Art Art */}
           <div className="w-16 h-16 bg-neon-cyan/10 border-2 border-neon-cyan flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-neon-cyan/20 animate-pulse" />
              <Music className={`w-8 h-8 text-neon-cyan z-10 ${isPlaying ? 'animate-bounce' : ''}`} />
              {isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-0.5 p-1 bg-black/40">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${Math.random()*40}%`, `${Math.random()*100}%`, `${Math.random()*20}%`] }}
                      transition={{ duration: 0.2 + i * 0.05, repeat: Infinity }}
                      className="w-1 bg-neon-cyan"
                    />
                  ))}
                </div>
              )}
           </div>

           <div className="flex-1 min-w-0">
              <h3 className="font-display text-xs text-neon-cyan tracking-widest truncate glitch-hard" data-text={currentTrack.title}>{currentTrack.title}</h3>
              <p className="text-[9px] font-mono text-neon-pink uppercase mt-1 tracking-tighter">{" > "} ARTIST: {currentTrack.artist}</p>
              <div className="mt-2 flex items-center gap-2">
                 <div className="w-2 h-2 bg-neon-pink animate-ping" />
                 <span className="text-[8px] font-mono text-neon-pink/60 uppercase">Streaming_Encrypted_Data</span>
              </div>
           </div>
        </div>

        {/* Progress Bar - RAW STYLE */}
        <div className="relative h-4 w-full bg-neon-cyan/10 border-2 border-neon-cyan/40">
            <motion.div
              className="absolute inset-y-0 left-0 bg-neon-cyan"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev} 
              className="w-10 h-10 flex items-center justify-center bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handleTogglePlay}
              className="w-14 h-14 flex items-center justify-center bg-neon-cyan text-black border-2 border-neon-cyan hover:bg-white transition-all shadow-[4px_4px_0_var(--color-neon-pink)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={handleNext} 
              className="w-10 h-10 flex items-center justify-center bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1">
             <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className={`w-2 h-2 ${i < 3 ? 'bg-neon-cyan' : 'bg-neon-cyan/20'}`} />
                ))}
             </div>
             <span className="text-[8px] font-mono text-neon-cyan/40">BUFFER_LINK_STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
