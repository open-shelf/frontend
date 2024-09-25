import { ChevronRight } from "lucide-react";
import Book from "./Book";

const genres = [
  { title: "Ficção Científica", author: "150 livros" },
  { title: "Romance", author: "200 livros" },
  { title: "Terror e Suspense", author: "120 livros" },
  { title: "Autoajuda", author: "80 livros" },
  { title: "Infantojuvenil", author: "100 livros" },
  { title: "Literatura Brasileira", author: "90 livros" },
  { title: "Espiritualidade", author: "70 livros" },
  { title: "HQs e Mangás", author: "110 livros" },
  { title: "Gastronomia", author: "60 livros" },
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
          <Book key={index} title={genre.title} author={genre.author} />
        ))}
      </div>
    </section>
  );
}
