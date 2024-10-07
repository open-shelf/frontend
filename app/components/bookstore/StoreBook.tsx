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
  description: string;
  genre: string;
  imageUrl: string;
  publishDate: string;
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

export default function StoreBook() {
  const [storeBooks, setStoreBooks] = useState<BookData[]>([]);
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
        // Fetch all books data from the program
        const allBooks = await programUtils.fetchAllBooks();

        console.log("All books:", allBooks);

        // Filter books that are available in the store
        const storeBooks = allBooks.filter((book) => {
          // Exclude fully purchased books
          if (book.bookPurchased) {
            return false;
          }

          // Check if any chapter is purchased by the user
          const hasUserPurchasedChapter = book.chapters.some(
            (chapter: { isPurchased: any }) => chapter.isPurchased
          );

          // Check if the user has staked in this book
          const hasUserStaked = book.stakes.some(
            (stake: { staker: string | undefined }) =>
              stake.staker === wallet.publicKey?.toString()
          );

          // Include the book if the user hasn't purchased any chapters or staked in it
          return !hasUserPurchasedChapter && !hasUserStaked;
        });

        console.log("Store books:", storeBooks);
        setStoreBooks(storeBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [connection, wallet]);

  if (loading) {
    return (
      <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
        <p>Loading store books...</p>
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
        <h2 className="text-2xl font-bold text-gray-900">In Store</h2>
        <a
          href="#"
          className="text-primary hover:underline flex items-center transition-colors duration-200"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      {storeBooks.length > 0 ? (
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {storeBooks.map((book, index) => (
            <Book key={index} {...book} showPrice={true} />
          ))}
        </div>
      ) : (
        <p>No books available in the store.</p>
      )}
    </section>
  );
}
