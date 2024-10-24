import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { fetchAuthorBooks, fetchAuthorEarnings } from "../../utils/authorUtils";
import { Book } from "../../utils/programUtils";

const AuthorBoard: React.FC = () => {
  const { publicKey } = useWallet();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    if (publicKey) {
      fetchAuthorBooks(publicKey.toString()).then(setBooks);
      fetchAuthorEarnings(publicKey.toString()).then(setTotalEarnings);
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-gray-800">
        Please connect your wallet to view your author board.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 text-gray-800">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-4">Your Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.bookPubKey}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-md"
            >
              <img
                src={book.metadata.imageUrl}
                alt={book.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{book.title}</h2>
            </div>
          ))}
        </div>
        <Link href="/write-book">
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Write New Book
          </button>
        </Link>
      </div>
      <div className="w-full md:w-64 bg-white p-4 rounded-lg border border-gray-300 shadow-md">
        <h2 className="text-xl font-bold mb-4">Author Stats</h2>
        <p className="text-lg">
          Total Earnings:{" "}
          <span className="text-green-600">${totalEarnings.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          Books Published: <span className="font-semibold">{books.length}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthorBoard;
