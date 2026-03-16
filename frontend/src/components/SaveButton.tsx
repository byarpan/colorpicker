import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function SaveButton({ onClick, loading, disabled }: SaveButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97, y: 1 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className="brutal-btn w-full py-4 mt-6 bg-gradient-to-r from-electric to-cyber text-black text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 spin-brutal" />
          <span>Broadcasting to Stellar...</span>
        </>
      ) : (
        <span>Save Selection to Stellar</span>
      )}
    </motion.button>
  );
}
