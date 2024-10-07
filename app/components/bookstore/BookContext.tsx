"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the structure for the book details
interface BookDetails {
  id: string;
  title: string;
  author: string;
  fullBookPrice: number;
  totalStake: number;
  chapters: {
    index: number;
    isPurchased: boolean;
    name: string;
    url: string;
    price: number;
  }[];
  stakes: { staker: string; amount: number }[];
  image: string;
  bookPubKey: string;
  bookPurchased: boolean;
}

// Define the context type
interface BookContextType {
  bookDetails: BookDetails | null;
  setBookDetails: (details: BookDetails | null) => void;
  stakeAndPurchaseBook: (bookId: string) => Promise<void>;
}

// Create context with a default value
const BookContext = createContext<BookContextType>({
  bookDetails: null,
  setBookDetails: () => {},
  stakeAndPurchaseBook: () => Promise.resolve(),
});

// Export the hook for accessing the context
export const useBook = () => useContext(BookContext);

// Provide the context to the app
export const BookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);

  const stakeAndPurchaseBook = async (bookId: string) => {
    try {
      // Implement the logic to stake and purchase the entire book
      // This might involve calling an API endpoint or interacting with a smart contract
      console.log(`Staking and purchasing book with ID: ${bookId}`);
      // Update the book details or user's library as needed
    } catch (error) {
      console.error("Error staking and purchasing book:", error);
    }
  };

  return (
    <BookContext.Provider
      value={{
        bookDetails,
        setBookDetails,
        stakeAndPurchaseBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
