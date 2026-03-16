import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import Tilt from 'react-parallax-tilt';
import { Palette } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { pickColor, getUserColor } from '../lib/stellar';
import SaveButton from './SaveButton';
import toast from 'react-hot-toast';

export default function ColorSelectorCard() {
  const { address, selectedColor, setSelectedColor, saving, setSaving, setStoredColor } = useAppStore();

  const handleSave = async () => {
    if (!address) {
      toast.error('Connect your wallet first!');
      return;
    }
    setSaving(true);
    try {
      await pickColor(address, selectedColor);
      setStoredColor(selectedColor);
      toast.success('Color successfully stored on Stellar!', {
        icon: '✨',
        style: {
          background: '#111118',
          color: '#fff',
          border: '3px solid #39ff14',
          boxShadow: '5px 5px 0px #000',
        },
      });
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('User declined')) {
        toast.error('Transaction cancelled by user');
      } else if (msg === 'ACCOUNT_NOT_FUNDED') {
        toast.error('Account not funded! Get free XLM at Friendbot', {
          duration: 5000,
        });
      } else {
        toast.error('Transaction failed. Please try again.', {
          style: {
            background: '#111118',
            color: '#fff',
            border: '3px solid #ff4444',
            boxShadow: '5px 5px 0px #000',
          },
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable
      glareMaxOpacity={0.05}
      glareColor="#a855f7"
      scale={1.01}
    >
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="brutal-card p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-cyber border-3 border-black flex items-center justify-center"
               style={{ boxShadow: '3px 3px 0px #000' }}>
            <Palette className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider font-[var(--font-heading)]">
            Color Selector
          </h2>
        </div>

        {/* Preview */}
        <motion.div
          className="w-full h-32 border-3 border-black mb-6 flex items-center justify-center relative overflow-hidden"
          animate={{ backgroundColor: selectedColor }}
          transition={{ duration: 0.3 }}
          style={{ boxShadow: `6px 6px 0px #000` }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedColor}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-mono text-2xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{
                color: isLightColor(selectedColor) ? '#000' : '#fff',
              }}
            >
              {selectedColor.toUpperCase()}
            </motion.span>
          </AnimatePresence>

          {/* Scanlines effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
        </motion.div>

        {/* Color Picker */}
        <div className="mb-2">
          <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
        </div>

        {/* Hex Input */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Hex</span>
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setSelectedColor(val);
            }}
            className="flex-1 bg-surface border-3 border-border px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-electric transition-colors"
            maxLength={7}
          />
        </div>

        {/* Quick Colors */}
        <div className="flex gap-2 mt-4">
          {['#00d4ff', '#a855f7', '#39ff14', '#ff6b6b', '#fbbf24', '#f472b6'].map((c) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(c)}
              className="w-8 h-8 border-2 border-black cursor-pointer"
              style={{
                backgroundColor: c,
                boxShadow: selectedColor === c ? `0 0 12px ${c}` : '3px 3px 0px #000',
              }}
            />
          ))}
        </div>

        {/* Save Button */}
        <SaveButton
          onClick={handleSave}
          loading={saving}
          disabled={!address}
        />

        {!address && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-zinc-500 text-center mt-3"
          >
            Connect your wallet to save
          </motion.p>
        )}
      </motion.div>
    </Tilt>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
