import { ChevronRight } from "lucide-react";
import Book from "./Book";

const genres = [
  { name: "Ficção Científica", books: "150" },
  { name: "Romance", books: "200" },
  { name: "Terror e Suspense", books: "120" },
  { name: "Autoajuda e crescimento", books: "80" },
  { name: "Infantojuvenil", books: "100" },
  { name: "Literatura Brasileira", books: "90" },
  { name: "Religião e Espiritualidade", books: "70" },
  { name: "HQ's e Mangás", books: "110" },
  { name: "Gastronomia", books: "60" },
];

export default function StoreBook() {
  return (
    <section className="bg-background p-6 rounded-2xl shadow-md">
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
          <Book
            key={index}
            title={genre.name}
            subtitle={`${genre.books} books`}
          />
        ))}
      </div>
    </section>
  );
}
