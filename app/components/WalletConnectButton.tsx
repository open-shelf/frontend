"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import crypto from "crypto";

const WalletConnectButton = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState("1"); // Default value set to "1"

  const handleBuyCrypto = () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    const address = publicKey.toString();
    const secret = "secret"; // Replace with your actual secret
    const signatureInput = `${address}${secret}`;
    const signature = crypto
      .createHash("sha512")
      .update(signatureInput)
      .digest("hex");

    const baseUrl = "https://exchange.mercuryo.io/";
    const widgetId = "4dda8867-45de-4473-8f9b-6a929c6ff730"; // Replace with your actual widget ID

    // Fetch the amount directly from the input element
    const amountInput = document.querySelector(
      ".buy-crypto-input"
    ) as HTMLInputElement;
    const amount = amountInput ? amountInput.value : "1";

    console.log(amount);

    const params = new URLSearchParams({
      widget_id: widgetId,
      type: "buy",
      currency: "SOL",
      network: "SOLANA",
      amount: amount,
      fiat_currency: "EUR",
      address: address,
      signature: signature,
    });

    const mercuryoUrl = `${baseUrl}?${params.toString()}`;

    window.open(
      mercuryoUrl,
      "MercuryoWidget",
      "width=500,height=600,resizable=yes,scrollbars=yes"
    );
  };

  useEffect(() => {
    setMounted(true);

    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };

    if (connected) {
      fetchBalance();
    } else {
      setBalance(null);
    }

    // Add custom option to the wallet dropdown
    const addCustomOption = () => {
      const dropdown = document.querySelector(".wallet-adapter-dropdown-list");
      if (dropdown && !dropdown.querySelector(".buy-crypto-option")) {
        const buyCryptoOption = document.createElement("li");
        buyCryptoOption.className =
          "wallet-adapter-dropdown-list-item buy-crypto-option";

        const input = document.createElement("input");
        input.type = "number";
        input.value = "1"; // Set default value to 1
        input.placeholder = "Amount";
        input.className = "buy-crypto-input";
        input.max = "99999"; // Set maximum value to 99999
        input.step = "0.1"; // Allow two decimal places
        // Remove the onchange event handler

        const button = document.createElement("button");
        button.onclick = handleBuyCrypto;
        button.textContent = "Quick Buy Solana";
        button.className = "buy-crypto-button";

        buyCryptoOption.appendChild(input);
        buyCryptoOption.appendChild(button);
        dropdown.appendChild(buyCryptoOption);
      }
    };

    // Check for the dropdown periodically and add the custom option
    const interval = setInterval(addCustomOption, 100);

    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  if (!mounted) return null;

  const shortenedAddress = publicKey
    ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`
    : "";

  const buttonContent = connected ? (
    <div className="wallet-info">
      <span className="wallet-address">{shortenedAddress}</span>
      <span className="wallet-balance">
        Bal: {balance?.toFixed(2) || "0.00"} SOL
      </span>
    </div>
  ) : (
    "Connect Wallet"
  );

  return (
    <div className="wallet-connect-button">
      <WalletMultiButton className="custom-wallet-button">
        {buttonContent}
      </WalletMultiButton>
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #3d5a80;
          color: white;
          font-size: 14px;
          font-weight: 600;
          width: 250px;
          height: 48px; // Slightly increased height
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
        }
        .wallet-adapter-button:hover {
          background-color: #4a6fa5;
          width: 250px;
        }
        .wallet-adapter-button-trigger {
          background-color: #3d5a80;
        }
        .wallet-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          line-height: 1.4; // Slightly increased line height
        }
        .wallet-address {
          font-size: 14px;
          font-weight: 600;
        }
        .wallet-balance {
          font-size: 12px;
          opacity: 0.8;
          margin-top: 1px; // Small positive margin
        }
        // ... rest of the existing styles ...
        .custom-wallet-button {
          width: 250px !important;
          padding: 0 15px !important;
          justify-content: center !important; // Changed to center
          flex-direction: column !important; // Added to stack content vertically
        }
        .buy-crypto-option {
          display: flex;
          align-items: center;
          padding: 6px 16px;
          width: 100%;
        }
        .buy-crypto-input {
          width: 60px; // Reduced width to support about 6 characters
          margin-right: 8px;
          padding: 4px;
          color: #333;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 12px;
        }
        .buy-crypto-button {
          background-color: #3d5a80;
          color: white;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
          flex-grow: 1;
          border-radius: 4px;
        }
        .buy-crypto-button:hover {
          background-color: #4a6fa5;
        }
      `}</style>
    </div>
  );
};

export default WalletConnectButton;
