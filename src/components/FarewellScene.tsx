import { useEffect, useState, useRef } from 'react';
import boyImg from '@/assets/boy.jpg';
import girlImg from '@/assets/girl.png';

const FarewellScene = () => {
  const [phase, setPhase] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Cinematic sequence timing
    const timers = [
      setTimeout(() => setPhase(1), 800),    // Girl appears
      setTimeout(() => setPhase(2), 2500),    // Boy appears walking
      setTimeout(() => setPhase(3), 4500),    // They face each other
      setTimeout(() => setPhase(4), 7000),    // Text: memories
      setTimeout(() => setPhase(5), 10000),   // Boy turns away
      setTimeout(() => setPhase(6), 12500),   // Final goodbye text
      setTimeout(() => setShowParticles(true), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none cursor-default">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        style={{ filter: 'saturate(0.3) contrast(1.2) brightness(0.6)' }}
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-[1]" />

      {/* Floating dust particles */}
      {showParticles && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-200/20"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Girl - sitting on bench at station */}
      <div
        className="absolute z-[3] transition-all ease-out"
        style={{
          bottom: '8%',
          right: '15%',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transitionDuration: '2.5s',
          filter: phase >= 5 ? 'brightness(0.5) saturate(0.2)' : 'brightness(0.85) saturate(0.7)',
          transitionProperty: 'all',
        }}
      >
        <div className="relative">
          <img
            src={girlImg}
            alt="Her"
            className="h-[55vh] max-h-[500px] object-contain drop-shadow-2xl"
            style={{
              filter: 'sepia(0.3) contrast(1.1)',
              maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            }}
          />
          {/* Soft glow beneath */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Boy - walking, then stopping */}
      <div
        className="absolute z-[4] transition-all ease-out"
        style={{
          bottom: '8%',
          left: phase >= 3 ? '18%' : phase >= 2 ? '5%' : '-20%',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 5
            ? 'translateX(-60px) scale(0.9)'
            : phase >= 3
              ? 'translateX(0) scale(1)'
              : 'translateX(0) scale(0.95)',
          transitionDuration: phase >= 5 ? '4s' : '3s',
          filter: phase >= 5 ? 'brightness(0.6) saturate(0.15)' : 'brightness(0.85) saturate(0.7)',
          transitionProperty: 'all',
        }}
      >
        <div className="relative">
          <img
            src={boyImg}
            alt="Me"
            className="h-[55vh] max-h-[500px] object-contain drop-shadow-2xl"
            style={{
              filter: 'sepia(0.3) contrast(1.1)',
              maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              transform: phase >= 5 ? 'scaleX(-1)' : 'scaleX(1)',
              transition: 'transform 3s ease',
            }}
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Cinematic text overlays */}
      <div className="absolute inset-0 z-[5] pointer-events-none flex flex-col items-center justify-center">

        {/* Opening - station name vibe */}
        <div
          className="absolute top-[8%] left-0 right-0 text-center transition-all duration-[3s] ease-out"
          style={{
            opacity: phase >= 1 && phase < 4 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <p className="text-amber-200/30 text-xs tracking-[1em] uppercase font-light">
            somewhere at a station
          </p>
        </div>

        {/* Memory text */}
        <div
          className="absolute top-[35%] left-0 right-0 text-center transition-all duration-[3s] ease-out px-8"
          style={{
            opacity: phase >= 4 && phase < 6 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p className="text-white/60 text-lg md:text-2xl font-light italic leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}
          >
            "কিছু মানুষ চিরকাল থাকে না...
          </p>
          <p className="text-white/40 text-base md:text-xl font-light italic mt-3"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}
          >
            তবুও তাদের স্মৃতি চিরকাল থেকে যায়"
          </p>
        </div>

        {/* Final goodbye */}
        <div
          className="absolute bottom-[15%] left-0 right-0 text-center transition-all duration-[4s] ease-out px-8"
          style={{
            opacity: phase >= 6 ? 1 : 0,
            transform: phase >= 6 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          }}
        >
          <h1
            className="text-4xl md:text-7xl font-extralight tracking-[0.3em] uppercase"
            style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #d4a574, #8b7355, #d4a574)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            বিদায়
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-600/40" />
            <p className="text-amber-200/25 text-[10px] tracking-[0.5em] uppercase">
              goodbye forever
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-600/40" />
          </div>
        </div>
      </div>

      {/* Letterbox bars for cinematic feel */}
      <div className="absolute top-0 left-0 right-0 h-[6%] bg-black z-[6]" />
      <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-black z-[6]" />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.8)',
        }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 z-[7] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-60px) translateX(-5px); opacity: 0.3; }
          75% { transform: translateY(-90px) translateX(15px); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default FarewellScene;
