import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useBook } from "./BookContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookDetailsPopupProps {
  title: string;
  author: string;
  description: string;
  publishedDate: string;
  genre: string;
  fullBookPrice: number;
  totalStake: number;
  bookPurchased: boolean;
  chapters: {
    index: number;
    isPurchased: boolean;
    name: string;
    url: string;
    price: number;
  }[];
  stakes: {
    staker: string;
    amount: number;
    earnings: number;
  }[];
  image: string;
  onClose: () => void;
}

export default function BookDetailsPopup({
  author,
  title,
  description,
  publishedDate,
  genre,
  fullBookPrice,
  totalStake,
  bookPurchased,
  chapters,
  stakes,
  image,
  onClose,
}: BookDetailsPopupProps) {
  const { setBookDetails } = useBook();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleViewPDF = () => {
    setBookDetails({
      title,
      author,
      fullBookPrice,
      totalStake,
      chapters,
      stakes,
      image,
    });
    router.push("/reader");
  };

  const handleStake = () => {
    console.log(`Staking book: ${title}`);
  };

  const handlePurchaseFullBook = () => {
    console.log(`Purchasing full book: ${title}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
            {image && (
              <Image
                src={image}
                alt={title}
                width={200}
                height={300}
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            )}
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-2 text-[#1D3557]">{title}</h2>
            {/* <p className="text-xl mb-4 text-[#457B9D]">By {author}</p> */}
            {description && <p className="mb-4 text-gray-700">{description}</p>}
            {publishedDate && (
              <p className="mb-2 text-gray-600">
                <span className="font-semibold">Published:</span>{" "}
                {publishedDate}
              </p>
            )}
            {genre && (
              <p className="mb-4 text-gray-600">
                <span className="font-semibold">Genre:</span> {genre}
              </p>
            )}
            <p className="mb-2 text-gray-600">
              <span className="font-semibold">Price:</span>{" "}
              {fullBookPrice / 1e9} SOL
            </p>
            <p className="mb-4 text-gray-600">
              <span className="font-semibold">Total Stake:</span>{" "}
              {totalStake / 1e9} SOL
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {chapters.length > 0 && (
                <Link href="/reader">
                  <button
                    className="bg-[#1D3557] text-white px-4 py-2 rounded hover:bg-[#2A4A6D] transition-colors"
                    onClick={handleViewPDF}
                  >
                    View PDF
                  </button>
                </Link>
              )}
              {!bookPurchased && (
                <button
                  onClick={handlePurchaseFullBook}
                  className="bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#27ae60] transition-colors"
                >
                  Purchase Book
                </button>
              )}
              {!bookPurchased && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
              <div className="relative inline-block">
                <button
                  onClick={handleStake}
                  className={`px-4 py-2 rounded transition-colors ${
                    bookPurchased
                      ? "bg-[#FFD700] text-black hover:bg-[#FFC300]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!bookPurchased}
                  onMouseEnter={() => !bookPurchased && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Stake
                </button>
                {showTooltip && !bookPurchased && (
                  <div className="absolute z-10 w-48 px-2 py-1 -mt-1 text-sm leading-tight text-white transform -translate-x-1/2 -translate-y-full bg-gray-800 rounded-lg shadow-lg top-0 left-1/2">
                    Purchase the book to stake
                    <svg
                      className="absolute z-10 w-6 h-6 text-gray-800 transform -translate-x-1/2 translate-y-1/4 fill-current stroke-current bottom-0 left-1/2"
                      width="8"
                      height="8"
                    >
                      <rect
                        x="12"
                        y="-10"
                        width="8"
                        height="8"
                        transform="rotate(45)"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
