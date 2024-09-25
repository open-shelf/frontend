import React from "react";
import { motion } from "framer-motion";
import retroImg from "./shelf_content/console/retro.png";

const consoles = [{ id: 1, image: retroImg, name: "PlayStation 5" }];

const ConsoleShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center pb-12">
      {consoles.map((console) => (
        <motion.div
          key={console.id}
          className="w-64 h-64 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={console.image.src}
            alt={console.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ConsoleShelf;
