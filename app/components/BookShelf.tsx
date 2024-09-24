import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import bonfireImg from "./books/bonfire.jpeg";
import silverImg from "./books/silver lake.jpg";
import tisch from "./books/tisch.jpg";
import dogImg from "./books/Doggo.jpg";

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
      <motion.button
        className="w-24 h-36 bg-gray-300 flex items-center justify-center shadow-md rounded pb-6"
        whileHover={{ scale: 1.1 }}
      >
        More
      </motion.button>
    </div>
  );
};

export default BookShelf;
