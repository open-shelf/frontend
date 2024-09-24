import React from "react";
import { motion } from "framer-motion";

const vinyls = [
  { id: 1, image: "/album1.jpg", title: "Album One" },
  { id: 2, image: "/album2.jpg", title: "Album Two" },
  { id: 3, image: "/album3.jpg", title: "Album Three" },
  { id: 4, image: "/album4.jpg", title: "Album Four" },
];

const VinylShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center">
      {vinyls.map((vinyl) => (
        <motion.div
          key={vinyl.id}
          className="w-32 h-32 rounded-full bg-gray-300 shadow-md relative flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={vinyl.image}
            alt={vinyl.title}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default VinylShelf;
