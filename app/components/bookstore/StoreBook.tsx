import { ChevronRight } from "lucide-react";
import Book from "./Book";

const genres = [
  { title: "Moby Dick", author: "Herman Melville" },
  { title: "War and Peace", author: "Leo Tolstoy" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling" },
  { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
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
        {genres.map((genre, index) => (
          <Book key={index} title={genre.title} author={genre.author} />
        ))}
      </div>
    </section>
  );
}
