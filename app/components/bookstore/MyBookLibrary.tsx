import { ChevronRight } from "lucide-react";
import Book from "./Book";

const books = [
  {
    author: "Pubkey123456",
    title: "1984",
    description: "A dystopian novel by George Orwell",
    publishedDate: "1949-06-08",
    genre: "Dystopian Fiction",
    chapterPrices: [
      { price: 1000, description: "Introduction to Oceania" },
      { price: 1500, description: "Winston's Rebellion" },
      { price: 2000, description: "The Party's Control" },
    ],
    fullBookPrice: 4000,
    totalStake: 10900,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker1", amount: 4000 },
      { staker: "Staker7", amount: 3500 },
      { staker: "Staker3", amount: 3400 },
    ],
  },
  {
    author: "Pubkey123456",
    title: "To Kill a Mockingbird",
    description: "A novel by Harper Lee about racial injustice",
    publishedDate: "1960-07-11",
    genre: "Classic Fiction",
    chapterPrices: [
      { price: 1200, description: "Scout's Childhood" },
      { price: 1600, description: "The Trial Begins" },
      { price: 2200, description: "Boo Radley's Revelation" },
    ],
    fullBookPrice: 4500,
    totalStake: 9700,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker2", amount: 4200 },
      { staker: "Staker4", amount: 3000 },
      { staker: "Staker5", amount: 2500 },
    ],
  },
  {
    author: "Pubkey123456",
    title: "Pride and Prejudice",
    description: "A romantic novel by Jane Austen",
    publishedDate: "1813-01-28",
    genre: "Romance",
    chapterPrices: [
      { price: 900, description: "The Bennet Family" },
      { price: 1400, description: "Mr. Darcy's Proposal" },
      { price: 1800, description: "Overcoming Prejudices" },
    ],
    fullBookPrice: 4100,
    totalStake: 11400,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker8", amount: 5000 },
      { staker: "Staker3", amount: 3500 },
      { staker: "Staker9", amount: 2900 },
    ],
  },
  {
    author: "Pubkey123456",
    title: "The Great Gatsby",
    description: "F. Scott Fitzgerald's critique of the American Dream",
    publishedDate: "1925-04-10",
    genre: "Classic Fiction",
    chapterPrices: [
      { price: 1100, description: "Nick Meets Gatsby" },
      { price: 1300, description: "Gatsby's Lavish Parties" },
      { price: 2100, description: "The Tragic Conclusion" },
    ],
    fullBookPrice: 4500,
    totalStake: 9600,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker6", amount: 4000 },
      { staker: "Staker10", amount: 2800 },
      { staker: "Staker1", amount: 2800 },
    ],
  },
];

export default function MyBookLibrary() {
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
