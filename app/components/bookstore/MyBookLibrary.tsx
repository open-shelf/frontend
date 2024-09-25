import { ChevronRight } from "lucide-react";
import Book from "./Book";

const books = [
  { title: "1984", author: "George Orwell" },
  { title: "To Kill a Mockingbird", author: "Harper Lee" },
  { title: "Pride and Prejudice", author: "Jane Austen" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
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
          <Book key={index} title={book.title} author={book.author} />
        ))}
      </div>
    </section>
  );
}
