import { Toaster } from 'react-hot-toast';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CurrentColorCard from './components/CurrentColorCard';
import ColorSelectorCard from './components/ColorSelectorCard';

export default function App() {
  return (
    <>
      <ThreeBackground />
      <Navbar />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#e4e4e7',
            border: '3px solid #2a2a3a',
            boxShadow: '5px 5px 0px #000',
            fontWeight: 600,
          },
        }}
      />

      <main className="relative z-10 min-h-screen pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left — Hero */}
          <div>
            <HeroSection />
            <CurrentColorCard />
          </div>

          {/* Right — Color Selector */}
          <div className="flex justify-center lg:justify-end">
            <ColorSelectorCard />
          </div>
        </div>
      </main>

      {/* Footer subtle line */}
      <footer className="relative z-10 border-t-3 border-border py-4 text-center">
        <p className="text-xs text-zinc-600 uppercase tracking-widest">
          Built on Stellar · Soroban Smart Contracts · Testnet
        </p>
      </footer>
    </>
  );
}
