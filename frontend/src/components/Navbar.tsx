import { motion } from 'framer-motion';
import { Wallet, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { checkWalletConnection, connectFreighter } from '../lib/stellar';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { address, setAddress, loading, setLoading } = useAppStore();

  const handleConnect = async () => {
    setLoading(true);
    try {
      const isInstalled = await checkWalletConnection();
      if (!isInstalled) {
        window.open('https://www.freighter.app/', '_blank');
        toast.error('Install Freighter wallet first!');
        return;
      }

      const result = await connectFreighter();
      if (result.address) {
        setAddress(result.address);
        toast.success('Wallet connected!');
      } else {
        toast.error(result.error || 'Connection failed');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const truncated = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 border-3 border-black bg-gradient-to-br from-electric to-cyber flex items-center justify-center"
               style={{ boxShadow: '4px 4px 0px #000' }}>
            <Zap className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-tight font-[var(--font-heading)]">
            <span className="gradient-text">Stellar</span>
            <span className="text-white">Color</span>
          </span>
        </motion.div>

        {/* Wallet */}
        {address ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="brutal-card px-4 py-2 flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-acid glow-acid pulse-glow" />
            <span className="text-sm font-mono text-zinc-300 font-semibold">
              {truncated}
            </span>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            disabled={loading}
            className="brutal-btn px-5 py-2.5 bg-electric text-black flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" strokeWidth={3} />
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}
