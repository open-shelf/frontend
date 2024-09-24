import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import vinyl from "./vinyls/v2.webp";

const vinyls = [
  { id: 1, image: vinyl, title: "Album One" },
  { id: 2, image: vinyl, title: "Album Two" },
  { id: 3, image: vinyl, title: "Album Three" },
  { id: 4, image: vinyl, title: "More Three" },
];

const VinylShelf: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center pb-1">
      {vinyls.map((vinyl) => (
        <motion.div
          key={vinyl.id}
          className="w-32 h-32 rounded-full bg-gray-300 shadow-md relative flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={vinyl.image}
              alt={vinyl.title}
              style={{ objectFit: "cover" }}
              quality={100}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VinylShelf;
