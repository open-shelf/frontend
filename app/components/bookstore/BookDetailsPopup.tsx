import Image from "next/image";
import { motion } from "framer-motion";
import { useBooks } from "./BookContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProgramUtils, Book as BookType } from "../../utils/programUtils";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import StakePopup from "./StakePopup";

interface BookDetailsPopupProps {
  book: BookType;
  onClose: () => void;
}

export default function BookDetailsPopup({
  book,
  onClose,
}: BookDetailsPopupProps) {
  const { books, setBooks } = useBooks();
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMintNFTPopup, setShowMintNFTPopup] = useState(false);

  const handleViewPDF = () => {
    router.push(`/reader?bookPubKey=${book.bookPubKey}`);
  };

  const handleStake = () => {
    setIsStakePopupOpen(true);
  };

  const handleCloseStakePopup = () => {
    setIsStakePopupOpen(false);
  };

  const handleStakeSuccess = (updatedBookInfo: BookType) => {
    const updatedBooks = books.map((b) =>
      b.bookPubKey === updatedBookInfo.bookPubKey ? updatedBookInfo : b
    );
    setBooks(updatedBooks);
  };

  const handlePurchaseFullBook = async () => {
    if (!wallet.publicKey) {
      setError("Please connect your wallet to purchase the book.");
      return;
    }

    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < book.fullBookPrice) {
      setError("Insufficient balance to purchase the book.");
      return;
    }

    setIsLoading(true);
    try {
      const programUtils = new ProgramUtils(connection, wallet);

      // Wait for the collection public key to be initialized
      await programUtils.initializeCollectionPubKey();

      console.log(
        "Collection PubKey:",
        programUtils.collectionPubKey?.toString()
      );
      if (!programUtils.collectionPubKey) {
        console.log(
          "No collection public key found. Prompting to mint user NFT."
        );
        setShowMintNFTPopup(true);
        return;
      }

      const bookPubKeyObj = new PublicKey(book.bookPubKey);
      const authorPubKeyObj = new PublicKey(book.author);

      console.log("Attempting to purchase full book...");
      const tx = await programUtils.purchaseFullBook(
        bookPubKeyObj,
        authorPubKeyObj,
        true
      );
      console.log("Full book purchase transaction:", tx);

      await new Promise((f) => setTimeout(f, 2000));

      console.log("Fetching updated book info...");
      const updatedBookInfo = await programUtils.fetchBook(bookPubKeyObj);

      // Update the books context
      const updatedBooks = books.map((b) =>
        b.bookPubKey === book.bookPubKey ? updatedBookInfo : b
      );
      setBooks(updatedBooks);

      console.log(
        "Book purchased:",
        updatedBookInfo.userOwnership.bookPurchased
      );
    } catch (error) {
      console.error("Error purchasing full book:", error);
      if (error instanceof Error) {
        setError(`Failed to purchase book: ${error.message}`);
      } else {
        setError("Failed to purchase book. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintUserNFT = async () => {
    try {
      const programUtils = new ProgramUtils(connection, wallet);
      console.log("Attempting to create user collection...");
      await programUtils.createUserCollection();
      console.log("User collection created successfully.");
      setShowMintNFTPopup(false);
      // Refresh the book data or perform any necessary updates
      // You might want to call a function to refresh the book data here
    } catch (error) {
      console.error("Error minting user NFT:", error);
      setError("Failed to mint user NFT. Please try again.");
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
            {book.metadata.imageUrl && (
              <Image
                src={book.metadata.imageUrl}
                alt={book.title}
                width={200}
                height={300}
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            )}
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-2 text-[#1D3557]">
              {book.title}
            </h2>
            <p className="mb-4 text-gray-700">{book.metadata.description}</p>
            <p className="mb-2 text-gray-600">
              <span className="font-semibold">Published:</span>{" "}
              {new Date(book.metadata.publishDate).toLocaleDateString()}
            </p>
            <p className="mb-4 text-gray-600">
              <span className="font-semibold">Genre:</span>{" "}
              {book.metadata.genre}
            </p>
            <p className="mb-2 text-gray-600">
              <span className="font-semibold">Price:</span>{" "}
              {book.fullBookPrice / 1e9} SOL
            </p>
            <p className="mb-4 text-gray-600">
              <span className="font-semibold">Total Stake:</span>{" "}
              {book.totalStake / 1e9} SOL
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {book.chapters.length > 0 && (
                <button
                  className="bg-[#1D3557] text-white px-4 py-2 rounded hover:bg-[#2A4A6D] transition-colors"
                  onClick={handleViewPDF}
                >
                  View PDF
                </button>
              )}
              {!book.userOwnership.bookPurchased ? (
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
                <p className="text-green-600 font-semibold">Book Purchased</p>
              )}
              <div className="relative inline-block">
                <button
                  onClick={handleStake}
                  className={`px-4 py-2 rounded transition-colors ${
                    book.userOwnership.bookPurchased
                      ? "bg-[#FFD700] text-black hover:bg-[#FFC300]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!book.userOwnership.bookPurchased}
                >
                  {book.userOwnership.amount > 0 ? "View Stake" : "Stake"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <StakePopup
          isOpen={isStakePopupOpen}
          onClose={handleCloseStakePopup}
          bookPubKey={book.bookPubKey}
          stakes={book.stakes}
          onStakeSuccess={handleStakeSuccess}
          totalStake={book.totalStake}
        />

        {showMintNFTPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Mint User NFT</h2>
              <p className="mb-4">
                You need to mint a user NFT before making a purchase.
              </p>
              <button
                onClick={handleMintUserNFT}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Mint User NFT
              </button>
              <button
                onClick={() => setShowMintNFTPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
