import { useEffect, useState, useRef } from 'react';
import boyImg from '@/assets/boy.jpg';
import girlImg from '@/assets/girl.png';

const FarewellScene = () => {
  const [phase, setPhase] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play video with sound on user interaction
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.6;
        videoRef.current.play().catch(() => {});
      }
    };
    
    // Try unmuting on first click/touch
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 7000),
      setTimeout(() => setPhase(5), 10000),
      setTimeout(() => setPhase(6), 12500),
      setTimeout(() => setShowParticles(true), 5000),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black select-none cursor-default"
      onClick={() => {
        if (videoRef.current && videoRef.current.muted) {
          videoRef.current.muted = false;
          videoRef.current.volume = 0.6;
          videoRef.current.play().catch(() => {});
        }
      }}
    >
      {/* Tap to unmute hint */}
      <div
        className="absolute top-[8%] left-1/2 -translate-x-1/2 z-[10] transition-opacity duration-[3s]"
        style={{ opacity: phase < 2 ? 1 : 0, pointerEvents: 'none' }}
      >
        <p className="text-white/40 text-xs tracking-widest animate-pulse">
          🔊 ক্লিক করুন শব্দ শুনতে
        </p>
      </div>

      {/* Video Background - WITH SOUND */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.55,
          filter: 'saturate(0.35) contrast(1.15) brightness(0.55)',
        }}
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlay - darker bottom for character blending */}
      <div className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)
          `,
        }}
      />

      {/* Floating dust particles */}
      {showParticles && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                backgroundColor: 'rgba(200, 170, 120, 0.15)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Girl - blended into the dark scene */}
      <div
        className="absolute z-[3] transition-all ease-out"
        style={{
          bottom: '-5%',
          right: '10%',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transitionDuration: '2.5s',
          transitionProperty: 'all',
        }}
      >
        <img
          src={girlImg}
          alt="Her"
          className="h-[65vh] max-h-[580px] object-contain"
          style={{
            filter: phase >= 5
              ? 'sepia(0.5) contrast(1.0) brightness(0.35) saturate(0.15)'
              : 'sepia(0.4) contrast(1.05) brightness(0.6) saturate(0.5)',
            transition: 'filter 3s ease',
            maskImage: `
              linear-gradient(to bottom, transparent 0%, black 8%, black 60%, transparent 95%),
              linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)
            `,
            WebkitMaskImage: `
              linear-gradient(to bottom, transparent 0%, black 8%, black 60%, transparent 95%)
            `,
            WebkitMaskComposite: 'source-in',
            mixBlendMode: 'luminosity',
          }}
        />
      </div>

      {/* Boy - blended into scene */}
      <div
        className="absolute z-[4] transition-all ease-out"
        style={{
          bottom: '-5%',
          left: phase >= 3 ? '12%' : phase >= 2 ? '2%' : '-25%',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 5
            ? 'translateX(-80px) scale(0.88)'
            : phase >= 3
              ? 'translateX(0) scale(1)'
              : 'translateX(0) scale(0.95)',
          transitionDuration: phase >= 5 ? '4s' : '3s',
          transitionProperty: 'all',
        }}
      >
        <img
          src={boyImg}
          alt="Me"
          className="h-[65vh] max-h-[580px] object-contain"
          style={{
            filter: phase >= 5
              ? 'sepia(0.5) contrast(1.0) brightness(0.35) saturate(0.15)'
              : 'sepia(0.4) contrast(1.05) brightness(0.6) saturate(0.5)',
            transition: 'filter 3s ease, transform 3s ease',
            transform: phase >= 5 ? 'scaleX(-1)' : 'scaleX(1)',
            maskImage: `
              linear-gradient(to bottom, transparent 0%, black 8%, black 60%, transparent 95%)
            `,
            WebkitMaskImage: `
              linear-gradient(to bottom, transparent 0%, black 8%, black 60%, transparent 95%)
            `,
            mixBlendMode: 'luminosity',
          }}
        />
      </div>

      {/* Cinematic text overlays */}
      <div className="absolute inset-0 z-[5] pointer-events-none flex flex-col items-center justify-center">
        {/* Opening */}
        <div
          className="absolute top-[10%] left-0 right-0 text-center transition-all duration-[3s] ease-out"
          style={{
            opacity: phase >= 1 && phase < 4 ? 0.7 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <p style={{ color: 'rgba(200,170,120,0.3)', fontSize: '10px', letterSpacing: '1em', textTransform: 'uppercase', fontWeight: 300 }}>
            somewhere at a station
          </p>
        </div>

        {/* Memory text */}
        <div
          className="absolute top-[32%] left-0 right-0 text-center transition-all duration-[3s] ease-out px-8"
          style={{
            opacity: phase >= 4 && phase < 6 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 'clamp(16px, 2.5vw, 26px)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            letterSpacing: '0.05em',
            lineHeight: 1.8,
          }}>
            "কিছু মানুষ চিরকাল থাকে না...
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 'clamp(14px, 2vw, 22px)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            letterSpacing: '0.05em',
            marginTop: '12px',
          }}>
            তবুও তাদের স্মৃতি চিরকাল থেকে যায়"
          </p>
        </div>

        {/* Final goodbye */}
        <div
          className="absolute bottom-[12%] left-0 right-0 text-center transition-all duration-[4s] ease-out px-8"
          style={{
            opacity: phase >= 6 ? 1 : 0,
            transform: phase >= 6 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(36px, 7vw, 80px)',
              fontWeight: 200,
              letterSpacing: '0.3em',
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #c9a87c, #7a6548, #c9a87c)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            বিদায়
          </h1>
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(180,140,80,0.4))' }} />
            <p style={{ color: 'rgba(200,170,120,0.2)', fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
              goodbye forever
            </p>
            <div style={{ width: '64px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(180,140,80,0.4))' }} />
          </div>
        </div>
      </div>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[6%] bg-black z-[6]" />
      <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-black z-[6]" />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ boxShadow: 'inset 0 0 250px 80px rgba(0,0,0,0.85)' }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 z-[7] pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.4; }
          50% { transform: translateY(-60px) translateX(-5px); opacity: 0.25; }
          75% { transform: translateY(-90px) translateX(15px); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default FarewellScene;
