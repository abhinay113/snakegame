import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start p-2 md:p-12 font-sans selection:bg-neon-pink selection:text-black overflow-hidden">
      {/* GLITCH OVERLAYS */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_2px,3px_100%]" />
      
      {/* VIRTUAL TERMINAL FRAME */}
      <header className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-baseline justify-between mb-8 pb-4 border-b-4 border-neon-cyan/20">
        <div className="flex flex-col">
          <h1 
            className="text-4xl md:text-6xl font-display uppercase tracking-tighter glitch-hard leading-none"
            data-text="SYSTEM_VOID.SNAKE"
          >
            SYSTEM_VOID.SNAKE
          </h1>
          <p className="text-xs font-mono text-neon-pink mt-2 animate-pulse">
            [STATUS: UNSTABLE] {" >> "} KERNEL_ATTACHED: 0x00F3FF {" >> "} SECTOR_SCAN: 99.4%
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-4 text-[10px] font-mono whitespace-nowrap overflow-hidden">
           <div className="flex flex-col border-l-2 border-neon-cyan pl-2">
              <span className="text-neon-cyan/40">MEMORY_DUMP</span>
              <span className="text-neon-cyan">884355813280</span>
           </div>
           <div className="flex flex-col border-l-2 border-neon-pink pl-2">
              <span className="text-neon-pink/40">USER_SIGNAL</span>
              <span className="text-neon-pink truncate max-w-[120px]">UNBOUNDED_ID</span>
           </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl flex flex-col xl:flex-row gap-12 items-start justify-center">
        {/* PRIMARY INTERFACE: GAME */}
        <motion.section 
          className="flex-1 w-full bg-black/40 border-4 border-neon-cyan relative group"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-neon-cyan" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-cyan" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-neon-cyan" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-cyan" />
          
          <div className="p-1 md:p-6 bg-black relative shadow-[0_0_30px_rgba(0,255,255,0.1)]">
             <div className="absolute top-2 left-2 flex gap-1 z-20">
                <div className="w-2 h-2 bg-neon-pink animate-ping" />
                <span className="text-[10px] text-neon-pink font-mono uppercase tracking-widest">Live_Feed</span>
             </div>
             <SnakeGame />
          </div>
        </motion.section>

        {/* SECONDARY INTERFACE: AUDIO & LOGS */}
        <motion.section 
          className="w-full xl:w-[400px] flex flex-col gap-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* AUDIO MODULE */}
          <div className="p-1 bg-neon-pink/20">
             <div className="bg-black border-2 border-neon-pink p-4">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-1 h-3 bg-neon-pink" />
                   <h2 className="font-display text-xs text-neon-pink uppercase">Audio_Relay</h2>
                </div>
                <MusicPlayer />
             </div>
          </div>

          {/* SYSTEM LOGS */}
          <div className="font-mono text-[9px] bg-black border-2 border-neon-cyan/30 p-4 space-y-1 text-neon-cyan/60 uppercase screen-tear">
             <p className="text-neon-cyan underline mb-2">INTERFACE_LOGS_v1.0</p>
             <p>{" > "} BOOTING SUBROUTINES...</p>
             <p>{" > "} GLITCH_CORE.DLL LOADED</p>
             <p>{" > "} PIXEL_DENSITY_SYNC: FAILURE (IGNORING) </p>
             <p>{" > "} AUDIO_BUFFER: INITIALIZING...</p>
             <p className="text-neon-pink">{" > "} ALERT: HEURISTIC ANALYSIS COMPLETE</p>
             <p>{" > "} USER_EMOTION_VIBE: "NEON_DARK"</p>
          </div>
        </motion.section>
      </main>

      {/* BACKGROUND GRID DECOR */}
      <div className="fixed inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-[0.05]">
         {[...Array(144)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-neon-cyan/20" />
         ))}
      </div>
    </div>
  );
}
