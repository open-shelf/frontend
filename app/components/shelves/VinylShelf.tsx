import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import vinyl from "./shelf_content/vinyls/v2.webp";

const vinyls = [
  { id: 1, image: vinyl, title: "Norman Rockwell" },
  { id: 2, image: vinyl, title: "Abbey Road" },
  { id: 3, image: vinyl, title: "StarBoy" },
  { id: 4, image: vinyl, title: "More Albums" },
];

const VinylShelf: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-wrap gap-4 justify-center items-center pb-3">
      {vinyls.map((vinyl) => (
        <motion.div
          key={vinyl.id}
          className="w-32 h-32 rounded-full bg-gray-300 shadow-md relative flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setHoveredId(vinyl.id)}
          onHoverEnd={() => setHoveredId(null)}
        >
          <div
            className={`w-full h-full ${
              hoveredId === vinyl.id ? "animate-spin-slow" : ""
            }`}
          >
            <Image
              src={vinyl.image}
              alt={vinyl.title}
              className="w-full h-full object-cover rounded-full"
              quality={100}
            />
          </div>
          {hoveredId === vinyl.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <p className="text-white text-sm font-semibold text-center px-2">
                {vinyl.title}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default VinylShelf;
