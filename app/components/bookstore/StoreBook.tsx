"use client";
import { ChevronRight } from "lucide-react";
import Book from "./Book";
import { useBooks } from "./BookContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Book as BookType } from "../../utils/programUtils";

export default function StoreBook() {
  const { books, loading, error } = useBooks();
  const wallet = useWallet();

  if (!wallet.publicKey) {
    return (
      <section className="bg-background p-6 rounded-2xl shadow-md border-2 border-[#A8DADC]">
        <p>Please connect your wallet to view the store.</p>
      </section>
    );
  }

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

  const storeBooks = books.filter((book: BookType) => {
    const { userOwnership } = book;
    console.log(book);
    return (
      !userOwnership.bookPurchased &&
      userOwnership.chaptersPurchased.length === 0
    );
  });

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
          {storeBooks.map((book: BookType) => (
            <Book key={book.bookPubKey} book={book} showPrice={true} />
          ))}
        </div>
      ) : (
        <p>No books available in the store.</p>
      )}
    </section>
  );
}
