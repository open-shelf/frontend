"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

const WalletConnectButton = () => {
  const { wallet, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="wallet-connect-button">
      <WalletMultiButton />
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #e63946;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }
        .wallet-adapter-button:hover {
          background-color: #e63946;
        }
      `}</style>
    </div>
  );
};

export default WalletConnectButton;
