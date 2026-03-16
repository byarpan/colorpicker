import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getUserColor } from '../lib/stellar';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CurrentColorCard() {
  const { address, storedColor, setStoredColor } = useAppStore();

  const fetchColor = async () => {
    if (!address) return;
    try {
      const color = await getUserColor(address);
      if (color) setStoredColor(color);
    } catch (err) {
      console.error('Error fetching color:', err);
    }
  };

  useEffect(() => {
    fetchColor();
  }, [address]);

  const displayColor = storedColor || '#1e1e2a';

  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      glareEnable
      glareMaxOpacity={0.1}
      glareColor="#00d4ff"
      scale={1.02}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="brutal-card p-6 mt-8 max-w-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Current Stored Color
          </h3>
          <motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              fetchColor();
              toast('Refreshing...', { icon: '🔄' });
            }}
            className="p-1.5 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-zinc-500" />
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 border-3 border-black flex-shrink-0"
            style={{
              backgroundColor: displayColor,
              boxShadow: `4px 4px 0px #000, 0 0 20px ${displayColor}40`,
            }}
            animate={{ backgroundColor: displayColor }}
            transition={{ duration: 0.5 }}
          />
          <div>
            <p className="font-mono text-lg font-bold text-white">
              {storedColor || '—'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {storedColor ? 'On-chain identity' : 'No color set yet'}
            </p>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}
