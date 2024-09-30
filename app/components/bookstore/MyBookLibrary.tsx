"use client";
import { ChevronRight } from "lucide-react";
import Book from "./Book";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../../utils/programUtils";
import { PublicKey } from "@solana/web3.js";

interface BookData {
  pubKey: string;
  author: string;
  title: string;
  metaUrl: string;
  fullBookPrice: number;
  totalStake: number;
  bookPurchased: boolean;
  chapters: {
    index: number;
    isPurchased: boolean;
    name: string;
    url: string;
    price: number;
  }[];
  stakes: {
    staker: string;
    amount: number;
    earnings: number;
  }[];
}

export default function MyBookLibrary() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!wallet.publicKey) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const programUtils = new ProgramUtils(connection, wallet);

      try {
        const demoBookPubKey = new PublicKey(
          "7dxU3uNTaSr5PvkA3o26EAWJAGRN4Xr1Rp2BwGbjDDv8"
        );
        const bookData = await programUtils.fetchBook(demoBookPubKey);
        bookData.pubKey = demoBookPubKey;
        setBooks([bookData]);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [connection, wallet]);

  if (!wallet.publicKey) {
    return (
      <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
        <p>Please connect your wallet to view your library.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
        <p>Loading your library...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Library</h2>
        <a
          href="#"
          className="text-primary hover:underline flex items-center transition-colors duration-200"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      {books.length > 0 ? (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {books.map((book, index) => (
            <Book key={index} {...book} showPrice={false} />
          ))}
        </div>
      ) : (
        <p>No books found in your library.</p>
      )}
    </section>
  );
}
