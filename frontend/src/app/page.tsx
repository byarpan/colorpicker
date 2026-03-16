import Header from "@/components/Header";
import ColorPicker from "@/components/ColorPicker";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      <Header />
      
      <div className="relative z-10">
        <ColorPicker />
        
        {/* Decorative elements */}
        <div className="fixed bottom-10 left-10 text-xs font-mono text-gray-600 tracking-widest hidden lg:block">
          STELLAR_COLOR // v0.1.0
        </div>
        
        <div className="fixed bottom-10 right-10 flex gap-6 hidden lg:flex">
          <div className="w-1 h-12 bg-gray-800 rounded-full" />
          <div className="w-1 h-8 bg-gray-800 rounded-full" />
          <div className="w-1 h-16 bg-gray-800 rounded-full" />
        </div>
      </div>
    </main>
  );
}
