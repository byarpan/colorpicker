# 🌟 StellarColor — Define Your Digital Aura

StellarColor is a high-end, decentralized application built on the **Stellar Blockchain**. It allows users to select a color that represents their digital identity and store it permanently on-chain using **Soroban Smart Contracts**.

![Neo-Brutalist Interface](https://img.shields.io/badge/Design-Neo--Brutalism-EBFF00?style=for-the-badge&logoColor=black)
![Stellar Testnet](https://img.shields.io/badge/Blockchain-Stellar_Testnet-black?style=for-the-badge&logo=stellar)

---

## ✨ Features

- **🌐 Decentralized Identity**: Store your personal "Aura" color permanently on the Stellar ledger.
- **🎨 Interactive UI**: A stunning Neo-Brutalist interface with futuristic Web3 aesthetics.
- **🌌 3D Environment**: Immersive living background with floating spheres and parallax particles powered by Three.js.
- **⚡ Soroban Integration**: Seamless interaction with Rust-based smart contracts.
- **🔌 Freighter Wallet**: One-click connection and secure transaction signing.
- **📱 Fully Responsive**: Optimized for Desktop, Tablet, and Mobile.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: TailwindCSS 4
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **Animations**: Framer Motion, GSAP
- **State Management**: Zustand
- **Wallet**: @stellar/freighter-api
- **SDK**: @stellar/stellar-sdk

### Backend (Smart Contract)
- **Language**: Rust
- **Framework**: Soroban SDK
- **Storage**: Persistent Ledger Entries

---

## 📂 Project Structure

```text
├── colorpicker/          # Soroban Smart Contract (Rust)
│   ├── contracts/        # Contract source code
│   ├── target/           # Compiled WASM files
│   └── README.md         # Contract-specific documentation
├── frontend/             # Neo-Brutalist React Interface
│   ├── src/              # Application logic and components
│   ├── public/           # Static assets
│   └── vite.config.ts    # Build configuration
└── README.md             # This file
```

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18+)
- **Rust & Cargo**
- **Stellar CLI**
- **Freighter Wallet** (Browser Extension)

### 2. Smart Contract (Optional)
If you wish to redeploy the contract:
```bash
cd colorpicker
# Build the contract
stellar contract build
# Deploy to testnet
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/color_picker.wasm --source-account <your-account> --network testnet
```

### 3. Frontend
```bash
cd frontend
# Install dependencies
npm install --legacy-peer-deps
# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔗 Deployed Contract Details

- **Network**: Stellar Testnet
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **RPC Endpoint**: `https://soroban-testnet.stellar.org`
- **Contract ID**: `CCEDEM7SRE7DUSHLFO54BKQB7TYVT6EWSCQEGJUH3ZDGDBMUF24FTLVW`
- **Explorer**: [View on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CCEDEM7SRE7DUSHLFO54BKQB7TYVT6EWSCQEGJUH3ZDGDBMUF24FTLVW)

---

## 📖 How to Use

1. **Connect**: Click the "Connect Wallet" button in the navbar to link your Freighter account.
2. **Identity**: Ensure your wallet is set to **Testnet** and has some test XLM (use Friendbot if needed).
3. **Select**: Use the interactive color picker to find your "Digital Aura".
4. **Save**: Click "Save Selection to Stellar".
5. **Confirm**: Sign the transaction in the Freighter popup.
6. **Success**: Once the ledger confirms, your color is permanently saved!

---

## 🛡️ License
Built for the Stellar ecosystem. Use it to color the decentralized web!
