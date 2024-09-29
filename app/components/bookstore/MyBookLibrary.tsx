"use client";
import { ChevronRight } from "lucide-react";
import Book from "./Book";
import { useState, useEffect } from "react";

interface BookData {
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/book-details-v2");
        const data = await response.json();
        setBooks(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

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
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {books.map((book, index) => (
          <Book key={index} {...book} showPrice={false} />
        ))}
      </div>
    </section>
  );
}
