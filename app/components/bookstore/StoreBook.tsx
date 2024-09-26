import { ChevronRight } from "lucide-react";
import Book from "./Book";

const storeBooks = [
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "Moby Dick",
    chapterPrices: [1200, 1700, 2000], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 4900,
    totalStake: 10500,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker3", amount: 4000 },
      { staker: "Staker8", amount: 3500 },
      { staker: "Staker2", amount: 3000 },
    ],
  },
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "War and Peace",
    chapterPrices: [1300, 1500, 2200], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 5000,
    totalStake: 9000,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker4", amount: 4000 },
      { staker: "Staker5", amount: 2500 },
      { staker: "Staker1", amount: 2500 },
    ],
  },
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "The Catcher in the Rye",
    chapterPrices: [1000, 1400, 1900], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 4300,
    totalStake: 10400,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker6", amount: 4000 },
      { staker: "Staker9", amount: 3400 },
      { staker: "Staker7", amount: 3000 },
    ],
  },
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "The Lord of the Rings",
    chapterPrices: [1500, 1800, 2300], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 5600,
    totalStake: 11900,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker5", amount: 5000 },
      { staker: "Staker8", amount: 4000 },
      { staker: "Staker10", amount: 2900 },
    ],
  },
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "Harry Potter and the Sorcerer's Stone",
    chapterPrices: [1100, 1600, 2100], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 4800,
    totalStake: 8600,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker4", amount: 3200 },
      { staker: "Staker7", amount: 3000 },
      { staker: "Staker3", amount: 2400 },
    ],
  },
  {
    author: "Pubkey123456", // Replace with actual Pubkey
    title: "The Hitchhiker's Guide to the Galaxy",
    chapterPrices: [1200, 1400, 2100], // Prices in smallest unit (e.g., lamports)
    fullBookPrice: 4700,
    totalStake: 9300,
    chapters: [
      "http://localhost:8000/info/chapter1.pdf",
      "http://localhost:8000/info/chapter2.pdf",
      "http://localhost:8000/info/chapter3.pdf",
    ],
    stakes: [
      { staker: "Staker2", amount: 4200 },
      { staker: "Staker9", amount: 3000 },
      { staker: "Staker6", amount: 2100 },
    ],
  },
];

export default function StoreBook() {
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
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {storeBooks.map((book, index) => (
          <Book key={index} {...book} showPrice={true} />
        ))}
      </div>
    </section>
  );
}
