"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../utils/programUtils";
import { BookDetails } from "../types/BookDetails";
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
} from "recharts";
import SearchBar from "../components/bookstore/SearchBar";
import { div } from "framer-motion/client";

const COLORS = ["#1D3557", "#457B9D", "#E63946", "#2A9D8F", "#264653"];

const StakedBooksPage = () => {
  const [stakedBooks, setStakedBooks] = useState<BookDetails[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

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
      value: stake.amount,
    }));
  };

  const prepareEarningsData = (book: BookDetails) => {
    return book.stakes.map((stake) => ({
      name: stake.staker.slice(0, 4) + "..." + stake.staker.slice(-4),
      earnings: stake.earnings,
    }));
  };

  if (!publicKey) {
    return (
      <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
        <p className="text-[#1D3557]">
          Please connect your wallet to view your staked books.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
        <p className="text-[#1D3557]">Loading your staked books...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md">
        <p className="text-[#E63946]">{error}</p>
      </section>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 pb-4">
        <SearchBar />
      </div>
      <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md flex">
        {/* Left side - Book list */}
        <div className="w-1/3 pr-4 border-r border-[#A8DADC]">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
            Staked Books
          </h2>
          {stakedBooks.length === 0 ? (
            <p className="text-[#1D3557]">You haven't staked any books yet.</p>
          ) : (
            <ul>
              {stakedBooks.map((book) => (
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
                    Earnings: {calculateTotalEarnings(book) / 1e9} SOL
                  </p>
                  <button className="mt-2 bg-[#457B9D] text-white px-4 py-2 rounded hover:bg-[#1D3557] transition-colors">
                    Claim Earnings
                  </button>
                </li>
              ))}
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
                    {calculateAverageStake(selectedBook) / 1e9} SOL
                  </p>
                </div>
              </div>

              <div className="mb-6 bg-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#1D3557]">
                  Stake Distribution
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={prepareStakeDistributionData(selectedBook)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        color: "#1D3557",
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#1D3557" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#1D3557]">
                  Earnings by Staker
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={prepareEarningsData(selectedBook)}>
                    <XAxis dataKey="name" tick={{ fill: "#1D3557" }} />
                    <YAxis tick={{ fill: "#1D3557" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        color: "#1D3557",
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#1D3557" }}>{value}</span>
                      )}
                    />
                    <Bar dataKey="earnings" fill="#457B9D" />
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
    </div>
  );
};

export default StakedBooksPage;
