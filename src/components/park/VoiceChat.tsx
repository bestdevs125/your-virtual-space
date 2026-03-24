import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceChatProps {
  isInsideHouse: boolean;
  currentHouseId: string | null;
  playerName: string;
}

const VoiceChat = ({ isInsideHouse, currentHouseId, playerName }: VoiceChatProps) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  // Simulated other users in the same house
  const [houseMembers] = useState([
    { name: 'Rafi', speaking: false },
    { name: 'Tania', speaking: true },
  ]);

  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      // Turn off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsMicOn(false);
      setIsSpeaking(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Setup analyser for voice activity
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setIsSpeaking(avg > 15);
          animFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();
        
        setIsMicOn(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    }
  }, [isMicOn]);

  // Cleanup on unmount or leaving house
  useEffect(() => {
    if (!isInsideHouse && isMicOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsMicOn(false);
      setIsSpeaking(false);
    }
  }, [isInsideHouse, isMicOn]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isInsideHouse) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20">
      <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 text-white min-w-[220px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold">🎙️ Voice Chat</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-600/50 text-green-300">
            House Only
          </span>
        </div>

        {/* Members in house */}
        <div className="space-y-1.5 mb-3">
          {/* Self */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : isMicOn ? 'bg-green-600' : 'bg-red-500'}`} />
            <span className="text-xs">{playerName} (You)</span>
            {isSpeaking && <span className="text-[10px] text-green-400">🔊</span>}
          </div>
          {/* Simulated members */}
          {houseMembers.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${m.speaking ? 'bg-green-400 animate-pulse' : 'bg-green-600'}`} />
              <span className="text-xs">{m.name}</span>
              {m.speaking && <span className="text-[10px] text-green-400">🔊</span>}
            </div>
          ))}
        </div>

        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
            isMicOn
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isMicOn ? '🔇 Mute Mic' : '🎤 Unmute Mic'}
        </button>

        <p className="text-[10px] opacity-40 mt-2 text-center">
          🔒 শুধু এই ঘরের ভিতরের মানুষরাই শুনতে পারবে
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;
