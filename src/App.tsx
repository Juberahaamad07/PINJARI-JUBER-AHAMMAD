import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity, Zap, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden selection:bg-cyan selection:text-black">
      {/* Visual background layers */}
      <div className="fixed inset-0 crt-grid opacity-30 z-0 pointer-events-none"></div>
      <div className="fixed inset-0 scanline z-50 pointer-events-none opacity-20"></div>
      
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center space-x-3">
          <Terminal className="text-cyan animate-pulse" size={18} />
          <h1 className="text-lg font-bold tracking-[0.3em] font-mono glitch-text" data-text="NEURAL_SNAKE_OS_v4.2">
            NEURAL_SNAKE_OS_v4.2
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">
            <Activity size={12} className="text-magenta" />
            <span>HEARTBEAT: ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">
            <Zap size={12} className="text-cyan fill-cyan" />
            <span>CPU_USAGE: 44%</span>
          </div>
          <div className="w-24 h-6 bg-white/5 border border-white/10 flex items-center px-2">
            <motion.div 
               animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="h-1 bg-cyan"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 space-y-8 z-10">
        
        {/* Game Area */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-6xl">
          
          {/* Sidebar Stats Left */}
          <div className="hidden lg:flex flex-col space-y-4 w-48 font-mono text-[11px] uppercase tracking-wider text-white/40">
            <div className="p-3 border border-white/10 bg-white/5">
                <span className="block text-cyan/60 mb-1">DATA_STREAM</span>
                <span className="text-xs text-white/80">0x882A...F012</span>
            </div>
            <div className="p-3 border border-white/10 bg-white/5">
                <span className="block text-magenta/60 mb-1">LOCAL_TIME</span>
                <span className="text-xs text-white/80">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400">
                <ShieldAlert size={16} className="mb-2" />
                <span className="block">SEC_PROTOCOL</span>
                <span className="text-[9px]">ENCRYPTED_AES256</span>
            </div>
          </div>

          {/* Center Game */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between w-full font-mono text-xs text-cyan tracking-[0.3em] uppercase px-2 mb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40">CURRENT_PAYLOAD</span>
                <span className="text-2xl font-bold">{currentScore.toString().padStart(6, '0')}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40">MAX_RECOVERY</span>
                <span className="text-2xl font-bold text-magenta">{highScore.toString().padStart(6, '0')}</span>
              </div>
            </div>
            
            <SnakeGame onScoreChange={handleScoreChange} isPaused={isPaused} />
            
            <button 
                onClick={() => setIsPaused(!isPaused)}
                className="mt-4 px-8 py-2 border border-white/20 text-[10px] uppercase font-mono tracking-[0.4em] hover:bg-white/5 transition-colors"
            >
                {isPaused ? 'RESUME_PROCESS' : 'HALT_PROCESS'}
            </button>
          </div>

          {/* Music Player Sidebar Right */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/5 border border-white/10 p-4 font-mono text-[10px] uppercase tracking-[0.2em] space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>SECTOR_A</span>
                    <span className="text-cyan">READ_ONLY</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>SECTOR_B</span>
                    <span className="text-magenta">WRITE_ERR</span>
                </div>
                <div className="flex justify-between">
                    <span>SECTOR_C</span>
                    <span className="text-cyan">BUFFER_OK</span>
                </div>
            </div>
            <MusicPlayer />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="h-10 border-t border-white/10 bg-black/80 flex items-center justify-center px-6 z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
        POWERED_BY_NEURAL_SYNAPSE // TERMINAL_ID: {Math.random().toString(36).substring(7).toUpperCase()} // UNKNOWN_ERROR_LOGGED
      </footer>
    </div>
  );
}
