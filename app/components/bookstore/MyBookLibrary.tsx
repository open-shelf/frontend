"use client";
import { ChevronRight } from "lucide-react";
import Book from "./Book";
import { useBooks } from "./BookContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Book as BookType } from "../../utils/programUtils";

export default function MyBookLibrary() {
  const { books, loading, error } = useBooks();
  const wallet = useWallet();

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

  const userLibrary = books.filter((book: BookType) => {
    const { userOwnership } = book;
    return (
      userOwnership.bookPurchased || userOwnership.chaptersPurchased.length > 0
    );
  });

  return (
    <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Library</h2>
        <a
          href="#"
          className="text-primary hover:underline flex items-center transition-colors duration-200 text-gray-900"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      <div className="flex space-x-6 overflow-x-auto pb-4 min-h-[200px]">
        {userLibrary.length > 0 ? (
          userLibrary.map((book: BookType) => (
            <Book key={book.bookPubKey} book={book} showPrice={false} />
          ))
        ) : (
          <p className="self-center text-gray-900">
            No books found in your library.
          </p>
        )}
      </div>
    </section>
  );
}
