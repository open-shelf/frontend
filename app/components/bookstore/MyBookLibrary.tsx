import { ChevronRight } from "lucide-react";
import Book from "./Book";

const authors = [
  { name: "J. R. R. Tolkien", books: "12" },
  { name: "Paulo Coelho", books: "8" },
  { name: "Stephen King", books: "15" },
  { name: "Ursula K. Le Guin", books: "10" },
  { name: "Isaac Asimov", books: "20" },
  { name: "Octavia E. Butler", books: "7" },
  { name: "James Patterson", books: "18" },
  { name: "Clarice Lispector", books: "9" },
  { name: "Frank Herbert", books: "6" },
];

export default function MyBookLibrary() {
  return (
    <section className="bg-background p-6 rounded-2xl shadow-md">
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
        {authors.map((author, index) => (
          <Book
            key={index}
            title={author.name}
            subtitle={`${author.books} books`}
          />
        ))}
      </div>
    </section>
  );
}
