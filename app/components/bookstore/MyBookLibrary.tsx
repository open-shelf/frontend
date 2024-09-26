import { ChevronRight } from "lucide-react";
import Book from "./Book";

const books = [
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "1984",
    chapterPrices: [1000, 1500, 2000], // Prices in smallest unit (e.g., lamports)
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
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "To Kill a Mockingbird",
    chapterPrices: [1200, 1600, 2200], // Prices in smallest unit (e.g., lamports)
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
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "Pride and Prejudice",
    chapterPrices: [900, 1400, 1800], // Prices in smallest unit (e.g., lamports)
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
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "The Great Gatsby",
    chapterPrices: [1100, 1300, 2100], // Prices in smallest unit (e.g., lamports)
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
