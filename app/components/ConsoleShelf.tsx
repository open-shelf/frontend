import React from "react";
import { motion } from "framer-motion";

const consoles = [
  { id: 1, image: "/console1.png", name: "PlayStation 5" },
  { id: 2, image: "/console2.png", name: "Xbox Series X" },
];

const ConsoleShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center pt-7">
      {consoles.map((console) => (
        <motion.div
          key={console.id}
          className="w-48 h-24 bg-gray-300 flex items-center justify-center shadow-md rounded"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={console.image}
            alt={console.name}
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ConsoleShelf;
