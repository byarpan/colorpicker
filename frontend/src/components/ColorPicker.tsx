"use client";

import { useState, useEffect } from "react";
import { Palette, Save, RefreshCw, ExternalLink } from "lucide-react";
import { pickColor, getUserColor, getWalletAddress } from "@/lib/stellar";

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [storedColor, setStoredColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [needsFunding, setNeedsFunding] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const fetchCurrentColor = async () => {
    const address = await getWalletAddress();
    if (address) {
      setUserAddress(address);
      setFetching(true);
      const color = await getUserColor(address);
      setStoredColor(color);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCurrentColor();
  }, []);

  const handleSave = async () => {
    let address = await getWalletAddress();
    
    if (!address) {
      // Prompt to connect if not already connected
      alert("Please connect your wallet first using the button in the header!");
      return;
    }

    setLoading(true);
    try {
      console.log("Preparing transaction for address:", address);
      const result = await pickColor(address, selectedColor);
      
      console.log("Transaction result:", result);
      setStoredColor(selectedColor);
      alert("Success! Your color selection has been permanently stored on the Stellar blockchain.");
    } catch (err: any) {
      console.error("Save error:", err);
      const msg = err.message || "";
      
      if (msg.includes("User declined")) {
        alert("Transaction canceled. You need to sign the transaction in Freighter to save your color.");
      } else if (msg === "ACCOUNT_NOT_FUNDED") {
        setNeedsFunding(true);
        alert("Your account is not funded on the Testnet! Please click the 'Fund Account' link below to get free XLM.");
      } else if (msg.startsWith("SIMULATION_FAILED")) {
        alert(`Blockchain analysis failed: ${msg.split(": ")[1]}. \n\nThis sometimes happens if the network is busy. Please try again!`);
      } else if (msg.startsWith("SIGNING_FAILED")) {
        alert(`Signature failed: ${msg.split(": ")[1]}`);
      } else if (msg.startsWith("TRANSACTION_ERROR")) {
        alert(`Transaction failed: ${msg.split(": ")[1]}`);
      } else {
        alert(`Failed to save color: ${msg || "Unknown error"} \n\nChecklist: \n1. Wallet is on 'Stellar Testnet' \n2. You have enough Testnet XLM \n3. Try refreshing the page!`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 px-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Info */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Define Your <br /> Digital Aura.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Your identity on the Stellar network is unique. Pick a color that represents you and store it forever in a decentralized registry.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="glass p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border border-white/10 shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: storedColor || "#1e293b" }}
                />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Currently Stored</p>
                  <p className="font-mono text-lg text-white">
                    {fetching ? "..." : (storedColor || "None Set")}
                  </p>
                </div>
              </div>
              <button 
                onClick={fetchCurrentColor}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <RefreshCw size={18} className={fetching ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Picker */}
        <div className="glass p-8 rounded-[2rem] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] -z-10 group-hover:bg-blue-600/20 transition-all" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Palette size={20} />
              <span>Color Selector</span>
            </div>
            
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all shadow-inner">
               <input 
                  type="color" 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-crosshair scale-[2] opacity-0"
               />
               <div 
                  className="absolute inset-0 pointer-events-none transition-colors duration-300" 
                  style={{ backgroundColor: selectedColor }}
               />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-mono font-bold tracking-widest text-lg shadow-2xl">
                   {selectedColor.toUpperCase()}
                 </div>
               </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-2px] active:translate-y-[0] shadow-xl"
          >
            <Save size={20} />
            {loading ? "Transacting..." : "Save Selection to Stellar"}
          </button>

          {needsFunding && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm animate-pulse">
              <p className="flex flex-col gap-2">
                <span>Account not funded!</span>
                <a 
                  href={`https://laboratory.stellar.org/#friendbot?addr=${userAddress}&network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline flex items-center gap-1"
                >
                  Click here to get Testnet XLM <ExternalLink size={14} />
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
