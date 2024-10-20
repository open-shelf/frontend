"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Book, ProgramUtils } from "../../utils/programUtils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// Define the context type
interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

// Create context with a default value
const BookContext = createContext<BookContextType | undefined>(undefined);

// Export the hook for accessing the context
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}

// Provide the context to the app
interface BookProviderProps {
  children: ReactNode;
}

export function BookProvider({ children }: BookProviderProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    async function fetchBooks() {
      if (!wallet.publicKey) {
        setLoading(false);
        return;
      }

      try {
        const programUtils = new ProgramUtils(connection, wallet);
        const fetchedBooks = await programUtils.fetchAllBooks();
        setBooks(fetchedBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Error fetching books");
        setLoading(false);
      }
    }

    fetchBooks();
  }, [connection, wallet]);

  const contextValue: BookContextType = {
    books,
    loading,
    error,
    setBooks,
  };

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  );
}
