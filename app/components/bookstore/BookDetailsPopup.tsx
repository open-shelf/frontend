import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface BookDetailsPopupProps {
  title: string;
  author: string;
  image?: string;
  description?: string;
  publishedDate?: string;
  genre?: string;
  pdfUrl?: string;
  onClose: () => void;
}

export default function BookDetailsPopup({
  title,
  author,
  image,
  description,
  publishedDate,
  genre,
  pdfUrl,
  onClose,
}: BookDetailsPopupProps) {
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
        className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
            <p className="text-xl mb-4 text-[#457B9D]">By {author}</p>
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
            <div className="flex flex-wrap gap-2 mt-4">
              {pdfUrl && (
                <Link
                  href={`/bookstore/reader?url=${encodeURIComponent(
                    pdfUrl
                  )}&title=${encodeURIComponent(title)}`}
                >
                  <button className="bg-[#1D3557] text-white px-4 py-2 rounded hover:bg-[#2A4A6D] transition-colors">
                    View PDF
                  </button>
                </Link>
              )}
              <button
                onClick={onClose}
                className="bg-[#A8DADC] text-[#1D3557] px-4 py-2 rounded hover:bg-[#8ECBD0] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
