import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useBook } from "./BookContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../../utils/programUtils";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import StakePopup from "./StakePopup";

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
  bookPubKey: string; // Add this prop
}

export default function BookDetailsPopup({
  author,
  title,
  description,
  publishedDate,
  genre,
  fullBookPrice,
  totalStake,
  bookPurchased: initialBookPurchased,
  chapters,
  stakes,
  image,
  onClose,
  bookPubKey, // Make sure this prop is included
}: BookDetailsPopupProps) {
  const { setBookDetails } = useBook();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isBookPurchased, setIsBookPurchased] = useState(initialBookPurchased);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [isUserStaked, setIsUserStaked] = useState(false);
  const [userStakeAmount, setUserStakeAmount] = useState<number>(0);
  const [userRewards, setUserRewards] = useState<number>(0);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false);

  useEffect(() => {
    if (stakes && wallet.publicKey) {
      const userStake = stakes.find(
        (stake) => stake.staker === wallet.publicKey?.toString()
      );
      if (userStake) {
        setIsUserStaked(true);
        setUserStakeAmount(userStake.amount);
        setUserRewards(userStake.earnings);
      } else {
        setIsUserStaked(false);
        setUserStakeAmount(0);
        setUserRewards(0);
      }
    }
  }, [stakes, wallet.publicKey]);

  const handleViewPDF = () => {
    setBookDetails({
      title,
      author,
      fullBookPrice,
      totalStake,
      chapters: chapters.map((chapter) => ({
        index: chapter.index,
        isPurchased: chapter.isPurchased,
        name: chapter.name,
        url: chapter.url,
        price: chapter.price,
      })),
      stakes,
      image,
      bookPubKey,
      bookPurchased: isBookPurchased,
      id: bookPubKey,
    });
    router.push("/reader");
  };

  const handleStake = () => {
    setIsStakePopupOpen(true);
  };

  const handleCloseStakePopup = () => {
    setIsStakePopupOpen(false);
  };

  const handleStakeSuccess = (updatedBookInfo: any) => {
    setBookDetails({
      ...updatedBookInfo,
      image,
      bookPurchased: isBookPurchased,
    });
  };

  const handlePurchaseFullBook = async () => {
    console.log(bookPubKey);
    if (!wallet.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);
    try {
      console.log(bookPubKey);
      const programUtils = new ProgramUtils(connection, wallet);

      const bookPubKeyObj = new PublicKey(bookPubKey);
      const authorPubKeyObj = new PublicKey(author);

      const tx = await programUtils.purchaseFullBook(
        bookPubKeyObj,
        authorPubKeyObj
      );
      console.log("Full book purchase transaction:", tx);

      await new Promise((f) => setTimeout(f, 5000));

      // Refresh book info
      const updatedBookInfo = await programUtils.fetchBook(bookPubKeyObj);

      updatedBookInfo.bookPubKey = bookPubKeyObj;

      console.log(updatedBookInfo);
      // Update the local state with the new book info
      const updatedBookDetails = {
        ...updatedBookInfo,
        image,
        bookPurchased: true, // Add this line
      };
      setBookDetails(updatedBookDetails);

      // Update the local purchase state
      setIsBookPurchased(true);

      console.log("Book purchased:", updatedBookInfo.bookPurchased);
    } catch (error) {
      console.error("Error purchasing full book:", error);
    } finally {
      setIsLoading(false);
    }
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
              {!isBookPurchased ? (
                <button
                  onClick={handlePurchaseFullBook}
                  className={`bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#27ae60] transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Purchase Book"}
                </button>
              ) : (
                <p className="text-green-600 font-semibold"></p>
              )}
              {!isBookPurchased && (
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
                    isBookPurchased
                      ? "bg-[#FFD700] text-black hover:bg-[#FFC300]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isBookPurchased}
                >
                  {isUserStaked ? "View Stake" : "Stake"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <StakePopup
          isOpen={isStakePopupOpen}
          onClose={handleCloseStakePopup}
          bookPubKey={bookPubKey}
          stakes={stakes}
          onStakeSuccess={handleStakeSuccess}
          totalStake={totalStake} // Add this line
        />

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
