import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ProgramUtils } from "../../utils/programUtils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface Chapter {
  name: string;
  url: string;
  index: number;
  price: number;
}

interface Book {
  title: string;
  description: string;
  genre: string;
  image_url: string;
  chapters: Chapter[];
}

interface WritingBoardProps {
  onClose: () => void;
}

const WritingBoard: React.FC<WritingBoardProps> = ({ onClose }) => {
  const router = useRouter();
  const [book, setBook] = useState<Book>({
    title: "",
    description: "",
    genre: "",
    image_url: "",
    chapters: [{ name: "", url: "", index: 0, price: 0 }],
  });
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [programUtils, setProgramUtils] = useState<ProgramUtils | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeProgram = async () => {
      if (publicKey && signTransaction && signAllTransactions) {
        try {
          const wallet = {
            publicKey,
            signTransaction,
            signAllTransactions,
          };
          const utils = new ProgramUtils(connection, wallet);
          setProgramUtils(utils);
        } catch (err: unknown) {
          console.error("Error initializing program:", err);
          setError(`Error initializing program: ${(err as Error).message}`);
        }
      }
    };

    initializeProgram();
  }, [publicKey, signTransaction, signAllTransactions, connection]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleChapterChange = (
    index: number,
    field: keyof Omit<Chapter, "index">,
    value: string | number
  ) => {
    setBook((prevBook) => ({
      ...prevBook,
      chapters: prevBook.chapters.map((chapter, i) =>
        i === index ? { ...chapter, [field]: value } : chapter
      ),
    }));
  };

  const handleAddChapter = () => {
    setBook((prevBook) => ({
      ...prevBook,
      chapters: [
        ...prevBook.chapters,
        { name: "", url: "", index: prevBook.chapters.length, price: 0 },
      ],
    }));
  };

  const handleRemoveChapter = (index: number) => {
    setBook((prevBook) => ({
      ...prevBook,
      chapters: prevBook.chapters
        .filter((_, i) => i !== index)
        .map((chapter, i) => ({ ...chapter, index: i })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programUtils) {
      setError("Program not initialized");
      return;
    }

    try {
      console.log("Submitting book...");
      const [tx, newBookPubKey] = await programUtils.addBook(
        book.title,
        book.description,
        book.genre,
        book.image_url,
        book.chapters.map((chapter) => ({
          name: chapter.name,
          url: chapter.url,
          index: chapter.index,
          price: Number(chapter.price),
        }))
      );
      console.log("Transaction signature:", tx);
      console.log("New book public key:", newBookPubKey.toString());

      // Clear form and show success message
      setBook({
        title: "",
        description: "",
        genre: "",
        image_url: "",
        chapters: [{ name: "", url: "", index: 0, price: 0 }],
      });
      setError(null);
      alert(
        `Book submitted successfully! Public Key: ${newBookPubKey.toString()}`
      );
      onClose();
    } catch (error: unknown) {
      console.error("Error submitting book:", error);
      setError(`Error submitting book: ${(error as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Write New Book</h2>

      {/* Add Wallet Button */}
      <div className="mb-4">
        <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600" />
      </div>

      {!publicKey && (
        <p className="text-red-500 mb-4">
          Please connect your wallet to submit a book.
        </p>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          Book Title (max 50 characters)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={book.title}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          maxLength={50}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image_url" className="block mb-2">
          Cover Image URL (max 200 characters)
        </label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={book.image_url}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          maxLength={200}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Book Description (max 200 characters)
        </label>
        <textarea
          id="description"
          name="description"
          value={book.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2 h-32"
          required
          maxLength={200}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="genre" className="block mb-2">
          Genre (max 50 characters)
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={book.genre}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          maxLength={50}
        />
      </div>

      <h3 className="text-xl font-bold mb-2">Chapters</h3>
      {book.chapters.map((chapter, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded relative">
          <h4 className="font-semibold mb-2">Chapter {index + 1}</h4>
          <input
            type="text"
            value={chapter.name}
            onChange={(e) => handleChapterChange(index, "name", e.target.value)}
            placeholder="Chapter Name (max 50 characters)"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            required
            maxLength={50}
          />
          <input
            type="url"
            value={chapter.url}
            onChange={(e) => handleChapterChange(index, "url", e.target.value)}
            placeholder="Chapter URL (max 100 characters)"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            required
            maxLength={100}
          />
          <div className="mb-2">
            <label
              htmlFor={`chapter-price-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Chapter Price (in SOL)
            </label>
            <input
              type="number"
              id={`chapter-price-${index}`}
              value={chapter.price}
              onChange={(e) =>
                handleChapterChange(index, "price", e.target.value)
              }
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              step="0.01"
              min="0"
              required
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleRemoveChapter(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddChapter}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Add Chapter
      </button>

      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          disabled={!publicKey}
        >
          Submit Book
        </button>
      </div>
    </form>
  );
};

export default WritingBoard;
