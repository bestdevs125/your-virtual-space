import { useState } from 'react';

export interface CharacterConfig {
  gender: 'male' | 'female';
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoeColor: string;
  // Accessories
  hasCap: boolean;
  capColor: string;
  hasBag: boolean;
  bagColor: string;
  hasGlasses: boolean;
  glassesColor: string;
  hasSunglasses: boolean;
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  gender: 'male',
  skinColor: '#e0b088',
  hairStyle: 'short',
  hairColor: '#2a1a0a',
  shirtColor: '#3366cc',
  pantsColor: '#334455',
  shoeColor: '#222222',
  hasCap: false,
  capColor: '#cc3333',
  hasBag: false,
  bagColor: '#8B4513',
  hasGlasses: false,
  glassesColor: '#333333',
  hasSunglasses: false,
};

const SKIN_COLORS = ['#e0b088', '#c68642', '#8d5524', '#f5d0a9', '#ffdbac', '#4a2912'];
const HAIR_COLORS = ['#2a1a0a', '#4a3728', '#8B4513', '#d4a574', '#cc3333', '#ffcc00', '#ff69b4', '#333', '#eee'];
const SHIRT_COLORS = ['#3366cc', '#cc3333', '#33cc66', '#cc8833', '#6633cc', '#ff69b4', '#00bcd4', '#ff5722', '#607d8b', '#fff', '#000'];
const PANTS_COLORS = ['#334455', '#222', '#1a237e', '#4e342e', '#555', '#880e4f', '#004d40'];
const SHOE_COLORS = ['#222', '#fff', '#cc3333', '#1a237e', '#4e342e'];
const CAP_COLORS = ['#cc3333', '#3366cc', '#333', '#fff', '#ffcc00', '#33cc66'];
const BAG_COLORS = ['#8B4513', '#333', '#1a237e', '#cc3333', '#607d8b'];
const GLASSES_COLORS = ['#333', '#000', '#8B4513', '#c0c0c0', '#ffd700'];
const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'curly', label: 'Curly' },
  { id: 'bald', label: 'Bald' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'bun', label: 'Bun' },
];

interface CharacterCustomizationProps {
  config: CharacterConfig;
  onChange: (config: CharacterConfig) => void;
  onClose: () => void;
}

const ColorPicker = ({ colors, selected, onSelect, label }: {
  colors: string[]; selected: string; onSelect: (c: string) => void; label: string;
}) => (
  <div className="mb-3">
    <p className="text-xs opacity-70 mb-1">{label}</p>
    <div className="flex gap-1 flex-wrap">
      {colors.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`w-6 h-6 rounded-md border-2 transition-all ${selected === c ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  </div>
);

const CharacterCustomization = ({ config, onChange, onClose }: CharacterCustomizationProps) => {
  const [tab, setTab] = useState<'body' | 'clothes' | 'accessories'>('body');
  const update = (partial: Partial<CharacterConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900/95 rounded-2xl p-6 text-white max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">👤 Character Customization</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
        </div>

        {/* Gender */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => update({ gender: 'male' })}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${config.gender === 'male' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🧑 Male
          </button>
          <button
            onClick={() => update({ gender: 'female' })}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${config.gender === 'female' ? 'bg-pink-600 ring-2 ring-pink-400' : 'bg-white/10 hover:bg-white/15'}`}
          >
            👩 Female
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {(['body', 'clothes', 'accessories'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t ? 'bg-white/20 ring-1 ring-white/40' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {t === 'body' ? '🧑 Body' : t === 'clothes' ? '👕 Clothes' : '🎒 Accessories'}
            </button>
          ))}
        </div>

        {tab === 'body' && (
          <>
            <ColorPicker colors={SKIN_COLORS} selected={config.skinColor} onSelect={c => update({ skinColor: c })} label="Skin Color:" />
            <ColorPicker colors={HAIR_COLORS} selected={config.hairColor} onSelect={c => update({ hairColor: c })} label="Hair Color:" />
            <div className="mb-3">
              <p className="text-xs opacity-70 mb-1">Hair Style:</p>
              <div className="flex gap-1 flex-wrap">
                {HAIR_STYLES.map(h => (
                  <button
                    key={h.id}
                    onClick={() => update({ hairStyle: h.id })}
                    className={`px-2 py-1 rounded-md text-xs transition-all ${config.hairStyle === h.id ? 'bg-white/25 ring-1 ring-white' : 'bg-white/10 hover:bg-white/15'}`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'clothes' && (
          <>
            <ColorPicker colors={SHIRT_COLORS} selected={config.shirtColor} onSelect={c => update({ shirtColor: c })} label="Shirt Color:" />
            <ColorPicker colors={PANTS_COLORS} selected={config.pantsColor} onSelect={c => update({ pantsColor: c })} label="Pants Color:" />
            <ColorPicker colors={SHOE_COLORS} selected={config.shoeColor} onSelect={c => update({ shoeColor: c })} label="Shoe Color:" />
          </>
        )}

        {tab === 'accessories' && (
          <>
            {/* Cap */}
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => update({ hasCap: !config.hasCap })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${config.hasCap ? 'bg-green-600' : 'bg-white/10'}`}
              >
                🧢 Cap {config.hasCap ? '✓' : ''}
              </button>
            </div>
            {config.hasCap && (
              <ColorPicker colors={CAP_COLORS} selected={config.capColor} onSelect={c => update({ capColor: c })} label="Cap Color:" />
            )}

            {/* Bag */}
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => update({ hasBag: !config.hasBag })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${config.hasBag ? 'bg-green-600' : 'bg-white/10'}`}
              >
                🎒 Bag {config.hasBag ? '✓' : ''}
              </button>
            </div>
            {config.hasBag && (
              <ColorPicker colors={BAG_COLORS} selected={config.bagColor} onSelect={c => update({ bagColor: c })} label="Bag Color:" />
            )}

            {/* Glasses */}
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => update({ hasGlasses: !config.hasGlasses, hasSunglasses: false })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${config.hasGlasses ? 'bg-green-600' : 'bg-white/10'}`}
              >
                👓 Glasses {config.hasGlasses ? '✓' : ''}
              </button>
              <button
                onClick={() => update({ hasSunglasses: !config.hasSunglasses, hasGlasses: false })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${config.hasSunglasses ? 'bg-green-600' : 'bg-white/10'}`}
              >
                🕶 Sunglasses {config.hasSunglasses ? '✓' : ''}
              </button>
            </div>
            {(config.hasGlasses || config.hasSunglasses) && (
              <ColorPicker colors={GLASSES_COLORS} selected={config.glassesColor} onSelect={c => update({ glassesColor: c })} label="Frame Color:" />
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-sm transition-all"
        >
          ✅ Done
        </button>
      </div>
    </div>
  );
};

export default CharacterCustomization;
