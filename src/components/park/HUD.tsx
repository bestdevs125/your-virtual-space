interface HUDProps {
  buildMode: boolean;
  onToggleBuild: () => void;
  selectedMaterial: string;
  onSelectMaterial: (m: string) => void;
  selectedColor: string;
  onSelectColor: (c: string) => void;
  selectedType: string;
  onSelectType: (t: string) => void;
  currentHouse: string | null;
  isOwner: boolean;
  playerName: string;
}

const MATERIALS = [
  { id: 'brick', label: '🧱 Brick', color: '#b5452a' },
  { id: 'glass', label: '🪟 Glass', color: '#88ccff' },
  { id: 'wood', label: '🪵 Wood', color: '#8B6914' },
  { id: 'stone', label: '🪨 Stone', color: '#888' },
];

const COLORS = [
  '#b5452a', '#cc3333', '#e67e22', '#f1c40f',
  '#27ae60', '#2980b9', '#8e44ad', '#ecf0f1',
  '#2c3e50', '#e74c3c', '#1abc9c', '#ffffff',
];

const TYPES = [
  { id: 'wall', label: '🧱 Wall' },
  { id: 'door', label: '🚪 Door' },
  { id: 'window', label: '🪟 Window' },
];

const HUD = ({
  buildMode,
  onToggleBuild,
  selectedMaterial,
  onSelectMaterial,
  selectedColor,
  onSelectColor,
  selectedType,
  onSelectType,
  currentHouse,
  isOwner,
  playerName,
}: HUDProps) => {
  return (
    <>
      {/* Top bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-black/70 text-white px-6 py-3 rounded-xl backdrop-blur-sm text-center">
          <h1 className="text-lg font-bold">🌳 Virtual Park</h1>
          <p className="text-xs opacity-80 mt-1">
            ক্লিক করে মাউস লক করুন • WASD হাঁটুন • ESC বের হন • B বিল্ড মোড
          </p>
        </div>
      </div>

      {/* Player info */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm font-bold">👤 {playerName}</p>
          {currentHouse && (
            <p className="text-xs mt-1">
              🏠 {currentHouse} {isOwner ? '(Owner ✅)' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Build mode toggle */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={onToggleBuild}
          className={`px-5 py-3 rounded-xl font-bold text-white transition-all ${
            buildMode
              ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {buildMode ? '🔨 Build Mode ON' : '🔨 Build Mode'}
        </button>
      </div>

      {/* Build panel */}
      {buildMode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 text-white min-w-[400px]">
            <p className="text-sm font-bold mb-2 text-center">🏗️ Building Panel</p>

            {/* Material selection */}
            <div className="mb-3">
              <p className="text-xs opacity-70 mb-1">Material:</p>
              <div className="flex gap-2 justify-center">
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMaterial(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedMaterial === m.id
                        ? 'ring-2 ring-white bg-white/20'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type selection */}
            <div className="mb-3">
              <p className="text-xs opacity-70 mb-1">Type:</p>
              <div className="flex gap-2 justify-center">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectType(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === t.id
                        ? 'ring-2 ring-white bg-white/20'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color palette */}
            <div>
              <p className="text-xs opacity-70 mb-1">Color:</p>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => onSelectColor(c)}
                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                      selectedColor === c ? 'border-white scale-110' : 'border-transparent hover:border-white/50'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <p className="text-[10px] opacity-50 mt-3 text-center">
              Click ground to place • Shift+Click to remove • ESC to exit build
            </p>
          </div>
        </div>
      )}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className={`w-2 h-2 rounded-full ${buildMode ? 'bg-amber-400' : 'bg-white'} opacity-70`} />
      </div>
    </>
  );
};

export default HUD;
