import React from "react";
import { motion } from "framer-motion";

const books = [
  { id: 1, name: "The Great Gatsby" },
  { id: 2, name: "1984" },
  { id: 3, name: "To Kill a Mockingbird" },
  { id: 4, name: "The Catcher in the Rye" },
];

const BookShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center">
      {books.map((book) => (
        <motion.div
          key={book.id}
          className="w-24 h-36 bg-gray-300 flex items-center justify-center shadow-md rounded"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-center text-sm font-bold">{book.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default BookShelf;
