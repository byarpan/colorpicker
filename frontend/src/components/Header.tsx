"use client";

import { useState, useEffect } from "react";
import { Wallet, Check, ExternalLink } from "lucide-react";
import { checkWalletConnection, connectFreighter } from "@/lib/stellar";

export default function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const isInstalled = await checkWalletConnection();
      if (!isInstalled) {
        const install = confirm("Freighter extension not found. Add it to your browser to continue.");
        if (install) window.open("https://www.freighter.app/", "_blank");
        return;
      }

      const result = await connectFreighter();
      
      if (result.address) {
        setAddress(result.address);
      } else {
        alert("Almost there! \n\n1. If Freighter just opened, please UNLOCK it with your password. \n2. Once unlocked, click 'Connect' again to finish the link.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Something went wrong while connecting. Please refresh and try once more.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center glass border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 glow-primary flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">StellarColor</span>
      </div>

      <div>
        {address ? (
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-full border-blue-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-mono text-blue-200">
              {typeof address === "string" 
                ? `${address.slice(0, 4)}...${address.slice(-4)}`
                : "Connected"}
            </span>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 glow-primary"
          >
            <Wallet size={18} />
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
