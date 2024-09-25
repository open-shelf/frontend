import { ChevronRight } from "lucide-react";
import Book from "./Book";

const storeBooks = [
  {
    title: "Moby Dick",
    author: "Herman Melville",
    description:
      "An epic tale of a whaling ship's crew quest for revenge against a giant white whale.",
    publishedDate: "1851-10-18",
    genre: "Adventure Fiction",
    image: "/images/moby-dick.jpg",
    pdfUrl: "https://example.com/moby-dick.pdf",
  },
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    description:
      "A historical novel that chronicles the French invasion of Russia and its impact on Tsarist society.",
    publishedDate: "1869-01-01",
    genre: "Historical Fiction",
    image: "/images/war-and-peace.jpg",
    pdfUrl: "https://example.com/war-and-peace.pdf",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "A story of teenage angst and alienation in post-World War II America.",
    publishedDate: "1951-07-16",
    genre: "Coming-of-age Fiction",
    image: "/images/catcher-in-the-rye.jpg",
    pdfUrl: "https://example.com/catcher-in-the-rye.pdf",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "An epic high-fantasy novel set in the fictional world of Middle-earth.",
    publishedDate: "1954-07-29",
    genre: "High Fantasy",
    image: "/images/lord-of-the-rings.jpg",
    pdfUrl: "https://example.com/lord-of-the-rings.pdf",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description:
      "The first book in the Harry Potter series, introducing the young wizard and his magical world.",
    publishedDate: "1997-06-26",
    genre: "Fantasy",
    image: "/images/harry-potter.jpg",
    pdfUrl: "https://example.com/harry-potter.pdf",
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    description:
      "A comedic science fiction series following the misadventures of Arthur Dent across the galaxy.",
    publishedDate: "1979-10-12",
    genre: "Science Fiction Comedy",
    image: "/images/hitchhikers-guide.jpg",
    pdfUrl: "https://example.com/hitchhikers-guide.pdf",
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
          <Book key={index} {...book} />
        ))}
      </div>
    </section>
  );
}
