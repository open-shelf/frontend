"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import BookDetailsPopup from "./BookDetailsPopup";

interface BookProps {
  author: string;
  title: string;
  chapterPrices: number[];
  fullBookPrice: number;
  totalStake: number;
  chapters: string[];
  stakes: { staker: string; amount: number }[];
  showPrice: boolean;
  image?: string;
  isRounded?: boolean;
}

export default function Book({
  author,
  title,
  chapterPrices,
  fullBookPrice,
  totalStake,
  chapters,
  stakes,
  showPrice,
  image,
  isRounded = false,
}: BookProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleBookClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="p-2">
      <motion.div
        className="flex flex-col items-center flex-shrink-0 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
        onClick={handleBookClick}
      >
        <div
          className={`relative w-32 h-48 mb-2 bg-primary shadow-md overflow-hidden bg-white ${
            isRounded ? "rounded-full" : "rounded-xl"
          }`}
        >
          {image ? (
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-2">
              <p className="text-sm text-center text-primary break-words text-[#1D3557]">
                {title}
              </p>
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-80 text-primary text-xs text-[#1D3557] px-2 py-1 rounded-full text-center">
            {author}
          </div>
        </div>
        <span className="text-sm text-center w-32 overflow-hidden text-ellipsis text-gray-800">
          {title}
        </span>
        {showPrice && (
          <span className="text-xs text-primary mt-1">
            Price: {fullBookPrice} lamports
          </span>
        )}
      </motion.div>
      {isPopupOpen && (
        <BookDetailsPopup
          author={author}
          title={title}
          chapterPrices={chapterPrices}
          fullBookPrice={fullBookPrice}
          totalStake={totalStake}
          chapters={chapters}
          stakes={stakes}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
