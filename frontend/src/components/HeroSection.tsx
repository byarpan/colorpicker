import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col justify-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-bold uppercase tracking-[0.3em] text-acid mb-4"
      >
        Stellar Blockchain · Soroban
      </motion.p>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] font-[var(--font-heading)]">
        <span className="gradient-text">Define</span>
        <br />
        <span className="text-white">Your Digital</span>
        <br />
        <motion.span
          className="gradient-text inline-block"
          animate={{
            textShadow: [
              '0 0 20px rgba(0,212,255,0.3)',
              '0 0 40px rgba(168,85,247,0.3)',
              '0 0 20px rgba(57,255,20,0.3)',
              '0 0 20px rgba(0,212,255,0.3)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Aura
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-zinc-400 text-lg max-w-md leading-relaxed"
      >
        Your identity on the Stellar network is unique.
        Choose a color that represents you and store it
        permanently on the decentralized registry.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-4 mt-8"
      >
        <div className="flex -space-x-2">
          {['#00d4ff', '#a855f7', '#39ff14', '#ff6b6b'].map((c, i) => (
            <motion.div
              key={c}
              className="w-8 h-8 rounded-full border-2 border-deep"
              style={{ backgroundColor: c, zIndex: 4 - i }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500 uppercase tracking-wider">
          Join 670K+ accounts on Testnet
        </span>
      </motion.div>
    </motion.div>
  );
}
