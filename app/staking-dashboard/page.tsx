"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../utils/programUtils";
import { BookDetails } from "../types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";
import crypto from "crypto";

import SearchBar from "../components/bookstore/SearchBar";
import { PublicKey } from "@solana/web3.js";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];

const StakedBooksPage = () => {
  const [stakedBooks, setStakedBooks] = useState<BookDetails[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [sortByEarnings, setSortByEarnings] = useState(false);

  useEffect(() => {
    const fetchStakedBooks = async () => {
      if (publicKey) {
        setLoading(true);
        setError(null);
        try {
          const programUtils = new ProgramUtils(connection, wallet);
          const books = await programUtils.fetchAllStakes(publicKey);
          setStakedBooks(books);
          if (books.length > 0) {
            setSelectedBook(books[0]);
          }
        } catch (error) {
          console.error("Error fetching staked books:", error);
          setError("Failed to fetch staked books. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchStakedBooks();
  }, [publicKey, connection, wallet]);

  const handleClaimReward = async (book: BookDetails) => {
    if (wallet.publicKey && wallet.connected) {
      try {
        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKeyObj = new PublicKey(book.pubKey);

        const tx = await programUtils.claimStakeEarnings(bookPubKeyObj);
        console.log(`Earnings claimed. Transaction: ${tx}`);

        // Wait for the transaction to be confirmed
        await new Promise((f) => setTimeout(f, 5000));

        // Fetch updated book info
        const updatedBookInfo = await programUtils.fetchBook(bookPubKeyObj);

        // Set earnings to 0 for the current user's stake
        const updatedStakes = updatedBookInfo.stakes.map(
          (stake: { staker: string | undefined }) => {
            if (stake.staker === wallet.publicKey?.toString()) {
              return { ...stake, earnings: 0 };
            }
            return stake;
          }
        );

        const updatedBook = { ...updatedBookInfo, stakes: updatedStakes };

        // Update the stakedBooks state with the new information
        setStakedBooks((prevBooks) =>
          prevBooks.map((b) => (b.pubKey === book.pubKey ? updatedBook : b))
        );

        // If the claimed book is the selected book, update it
        if (selectedBook && selectedBook.pubKey === book.pubKey) {
          setSelectedBook(updatedBook);
        }

        console.log("Successfully claimed reward for book");
        setErrorMessage(null); // Clear any previous error
      } catch (error) {
        console.error("Error claiming reward:", error);
        setErrorMessage("Failed to claim reward. Please try again.");

        // Automatically clear the error message after 5 seconds
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const generateMercuryoSellLink = (address: string, amount: number) => {
    const baseUrl = "https://exchange.mercuryo.io/";
    const widgetId = "4dda8867-45de-4473-8f9b-6a929c6ff730"; // Replace with your actual widget ID
    const secret = "secret"; // Replace with your actual secret

    const signatureInput = `${address}${secret}`;
    const signature = crypto
      .createHash("sha512")
      .update(signatureInput)
      .digest("hex");

    const params = new URLSearchParams({
      widget_id: widgetId,
      type: "sell",
      currency: "USDC",
      network: "SOLANA",
      amount: amount.toString(),
      fiat_currency: "EUR",
      address: address,
      signature: signature,
      fix_amount: "true",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const handleOffRamp = async (book: BookDetails) => {
    if (wallet.publicKey && wallet.connected) {
      try {
        // Claim rewards first
        await handleClaimReward(book);

        // Get the wallet's earnings from the book
        const walletEarnings = calculateWalletEarnings(book);
        const earningsInSOL = walletEarnings / 1e9; // Convert lamports to SOL

        // Generate the Mercuryo sell link
        const address = wallet.publicKey.toString();
        const sellLink = generateMercuryoSellLink(address, earningsInSOL);

        // Open the Mercuryo widget in a new window
        window.open(
          sellLink,
          "MercuryoWidget",
          "width=500,height=600,resizable=yes,scrollbars=yes"
        );

        console.log("Successfully initiated off-ramp process");
        setErrorMessage(null);
      } catch (error) {
        console.error("Error in off-ramp process:", error);
        setErrorMessage(
          "Failed to initiate off-ramp process. Please try again."
        );

        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const calculateTotalStake = (book: BookDetails) => {
    return book.stakes.reduce((sum, stake) => sum + stake.amount, 0);
  };

  const calculateTotalEarnings = (book: BookDetails) => {
    return book.stakes.reduce((sum, stake) => sum + stake.earnings, 0);
  };

  const calculateAverageStake = (book: BookDetails) => {
    const totalStake = calculateTotalStake(book);
    return totalStake / book.stakes.length;
  };

  const prepareStakeDistributionData = (book: BookDetails) => {
    return book.stakes.map((stake) => ({
      name: stake.staker.slice(0, 4) + "..." + stake.staker.slice(-4),
      value: stake.amount / 1e9, // Convert lamports to SOL
    }));
  };

  const prepareEarningsData = (book: BookDetails) => {
    const data = book.stakes.map((stake) => ({
      name: stake.staker.slice(0, 4) + "..." + stake.staker.slice(-4),
      earnings: stake.earnings / 1e9, // Convert to SOL
    }));

    if (sortByEarnings) {
      data.sort((a, b) => b.earnings - a.earnings);
    }

    return data;
  };

  // Add this function to calculate earnings for the current wallet
  const calculateWalletEarnings = (book: BookDetails) => {
    const walletStake = book.stakes.find(
      (stake) => stake.staker === wallet.publicKey?.toString()
    );
    return walletStake ? walletStake.earnings : 0;
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`${value.toFixed(2)} SOL (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 p-4">
        <SearchBar />
      </div>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      {!publicKey ? (
        <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
          <p className="text-[#1D3557]">
            Please connect your wallet to view your staked books.
          </p>
        </section>
      ) : loading ? (
        <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
          <p className="text-[#1D3557]">Loading your staked books...</p>
        </section>
      ) : error ? (
        <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
          <p className="text-[#E63946]">{error}</p>
        </section>
      ) : (
        <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md flex">
          {/* Left side - Book list */}
          <div className="w-1/3 pr-4 border-r border-[#A8DADC]">
            <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
              Staked Books
            </h2>
            {stakedBooks.length === 0 ? (
              <p className="text-[#1D3557]">
                You haven't staked any books yet.
              </p>
            ) : (
              <ul>
                {stakedBooks.map((book) => {
                  const walletEarnings = calculateWalletEarnings(book);
                  const walletStake = book.stakes.find(
                    (stake) => stake.staker === wallet.publicKey?.toString()
                  );
                  return (
                    <li
                      key={book.pubKey}
                      className={`mb-4 p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedBook?.pubKey === book.pubKey
                          ? "bg-[#A8DADC]"
                          : "bg-white hover:bg-[#A8DADC]"
                      }`}
                      onClick={() => setSelectedBook(book)}
                    >
                      <h3 className="text-lg font-semibold text-[#1D3557]">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[#457B9D]">by {book.author}</p>
                      <p className="text-[#1D3557] mt-2">
                        Your Earnings: {walletEarnings / 1e9} SOL
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {walletEarnings > 0 && (
                          <button
                            className="bg-[#457B9D] text-white px-4 py-2 rounded hover:bg-[#1D3557] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimReward(book);
                            }}
                          >
                            Claim Earnings
                          </button>
                        )}
                        {walletEarnings > 0 &&
                          walletStake &&
                          walletStake.amount > 0 && (
                            <button
                              className="bg-[#E63946] text-white px-4 py-2 rounded hover:bg-[#C1121F] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOffRamp(book);
                              }}
                            >
                              Withdraw To Bank/Credit Card
                            </button>
                          )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right side - Book details and analytics */}
          <div className="w-2/3 pl-4">
            {selectedBook ? (
              <>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
                  {selectedBook.title} Analytics
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-[#457B9D]">Total Stake</p>
                    <p className="text-xl font-semibold text-[#1D3557]">
                      {calculateTotalStake(selectedBook) / 1e9} SOL
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-[#457B9D]">Total Earnings</p>
                    <p className="text-xl font-semibold text-[#1D3557]">
                      {calculateTotalEarnings(selectedBook) / 1e9} SOL
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-[#457B9D]">Number of Stakers</p>
                    <p className="text-xl font-semibold text-[#1D3557]">
                      {selectedBook.stakes.length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-[#457B9D]">Average Stake</p>
                    <p className="text-xl font-semibold text-[#1D3557]">
                      {(calculateAverageStake(selectedBook) / 1e9).toFixed(4)}{" "}
                      SOL
                    </p>
                  </div>
                </div>

                <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-2 text-[#1D3557]">
                    Stake Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={prepareStakeDistributionData(selectedBook)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {prepareStakeDistributionData(selectedBook).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#1D3557]">
                      Earnings by Staker
                    </h3>
                    <button
                      className="px-3 py-1 bg-[#457B9D] text-white rounded hover:bg-[#1D3557] transition-colors"
                      onClick={() => setSortByEarnings(!sortByEarnings)}
                    >
                      {sortByEarnings ? "Sort by Staker" : "Sort by Earnings"}
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareEarningsData(selectedBook)}
                      margin={{ top: 20, right: 30, left: 65, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#1D3557" }}
                        axisLine={{ stroke: "#A8DADC" }}
                        tickLine={{ stroke: "#A8DADC" }}
                      />
                      <YAxis
                        tick={{ fill: "#1D3557" }}
                        axisLine={{ stroke: "#A8DADC" }}
                        tickLine={{ stroke: "#A8DADC" }}
                        label={{
                          value: "Earnings (SOL)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#1D3557",
                          offset: -50,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          color: "#1D3557",
                          border: "1px solid #A8DADC",
                          borderRadius: "4px",
                        }}
                        formatter={(value: number) => [
                          `${value.toFixed(4)} SOL`,
                          "Earnings",
                        ]}
                      />
                      <Bar
                        dataKey="earnings"
                        fill="#457B9D"
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {prepareEarningsData(selectedBook).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-[#1D3557]">
                Select a book to view its analytics.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default StakedBooksPage;
