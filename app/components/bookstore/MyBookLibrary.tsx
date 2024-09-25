import { ChevronRight } from "lucide-react";
import Book from "./Book";

const books = [
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in a totalitarian society.",
    publishedDate: "1949-06-08",
    genre: "Dystopian Fiction",
    image: "/images/1984.jpg",
    pdfUrl: "https://example.com/1984.pdf",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A novel about racial injustice and loss of innocence in the American South.",
    publishedDate: "1960-07-11",
    genre: "Southern Gothic",
    image: "/images/to-kill-a-mockingbird.jpg",
    pdfUrl: "https://example.com/to-kill-a-mockingbird.pdf",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners set in Georgian England.",
    publishedDate: "1813-01-28",
    genre: "Classic Romance",
    image: "/images/pride-and-prejudice.jpg",
    pdfUrl: "https://example.com/pride-and-prejudice.pdf",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A novel about the American Dream set in the Roaring Twenties.",
    publishedDate: "1925-04-10",
    genre: "American Literature",
    image: "/images/great-gatsby.jpg",
    pdfUrl: "https://example.com/great-gatsby.pdf",
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
          <Book key={index} {...book} />
        ))}
      </div>
    </section>
  );
}
