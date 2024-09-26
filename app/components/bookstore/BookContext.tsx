"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the structure for the book details
interface BookDetails {
  title: string;
  author: string;
  chapterPrices: number[];
  fullBookPrice: number;
  totalStake: number;
  chapters: string[];
  stakes: { staker: string; amount: number }[];
  image: string;
}

// Define the context type
interface BookContextType {
  bookDetails: BookDetails | null;
  setBookDetails: (details: BookDetails | null) => void;
}

// Create context with a default value
const BookContext = createContext<BookContextType>({
  bookDetails: null,
  setBookDetails: () => {},
});

// Export the hook for accessing the context
export const useBook = () => useContext(BookContext);

// Provide the context to the app
export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);

  return (
    <BookContext.Provider value={{ bookDetails, setBookDetails }}>
      {children}
    </BookContext.Provider>
  );
};
