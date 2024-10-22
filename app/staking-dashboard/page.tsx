"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import SearchBar from "../components/bookstore/SearchBar";
import StakedBooksPage from "../components/staking-dashboard/StakedBooksPage";

const StakingDashboardPage = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 p-4">
        <SearchBar />
      </div>
      <StakedBooksPage
        publicKey={publicKey}
        connection={connection}
        wallet={wallet}
      />
    </main>
  );
};

export default StakingDashboardPage;
