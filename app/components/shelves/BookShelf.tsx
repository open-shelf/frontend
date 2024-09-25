import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import bonfireImg from "./shelf_content/books/bonfire.jpeg";
import silverImg from "./shelf_content//books/silver lake.jpg";
import tisch from "./shelf_content/books/tisch.jpg";
import dogImg from "./shelf_content/books/Doggo.jpg";

const books = [
  { id: 1, name: "Bonfire", image: bonfireImg },
  { id: 2, name: "By the Silver Lake", image: silverImg },
  {
    id: 3,
    name: "Tisch",
    image: tisch,
  },
  {
    id: 4,
    name: "The Dog",
    image: dogImg,
  },
];

const BookShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center pb-6">
      {books.map((book) => (
        <motion.div
          key={book.id}
          className="w-24 h-36 bg-gray-300 flex items-center justify-center shadow-md rounded overflow-hidden relative"
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={book.image}
              alt={book.name}
              layout="fill"
              objectFit="cover"
              quality={80}
            />
            <div className="absolute inset-0 vignette-effect"></div>
          </div>
        </motion.div>
      ))}
      <Link href="/bookstore">
        <motion.div
          className="w-24 h-36 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative w-full h-full bg-gray-700 rounded shadow-md overflow-hidden">
            <div className="absolute bottom-0 right-0 w-6 h-36 bg-gray-600 rounded-sm"></div>
            <div className="absolute bottom-0 left-0 w-6 h-36 bg-gray-500 rounded-sm"></div>
            <div className="absolute bottom-0 left-6 w-6 h-36 bg-gray-400 rounded-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              More
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default BookShelf;
