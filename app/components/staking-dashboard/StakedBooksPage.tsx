import React, { useState, useEffect } from "react";
import { useBooks } from "../bookstore/BookContext";
import { Book } from "../../utils/programUtils";
import BookList from "./BookList";
import BookAnalytics from "./BookAnalytics";
import { AnimatePresence, motion } from "framer-motion";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

interface StakedBooksPageProps {
  publicKey: PublicKey | null;
  connection: Connection;
  wallet: WalletContextState;
}

const StakedBooksPage: React.FC<StakedBooksPageProps> = ({
  publicKey,
  connection,
  wallet,
}) => {
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const [stakedBooks, setStakedBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!booksLoading && !booksError) {
      const userStakedBooks = books.filter((book) =>
        book.stakes.some((stake) => stake.staker === publicKey?.toString())
      );
      setStakedBooks(userStakedBooks);
      if (userStakedBooks.length > 0) {
        setSelectedBook(userStakedBooks[0]);
      } else {
        setSelectedBook(null);
      }
      setLoading(false);
    }
  }, [books, booksLoading, booksError, publicKey]);

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
    <section className="bg-[#F1FAEE] p-6 rounded-2xl shadow-md flex">
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
      {stakedBooks.length === 0 ? (
        <div className="w-full text-center">
          <p className="text-[#1D3557] text-xl">
            You haven't staked any books yet. Stake a book to see analytics
            here!
          </p>
        </div>
      ) : (
        <>
          <BookList
            stakedBooks={stakedBooks}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            wallet={wallet}
            connection={connection}
            setErrorMessage={setErrorMessage}
          />
          {selectedBook && (
            <BookAnalytics selectedBook={selectedBook} wallet={wallet} />
          )}
        </>
      )}
    </section>
  );
};

export default StakedBooksPage;
