import React from "react";
import { Book, ProgramUtils } from "../../utils/programUtils";
import { PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

interface BookListProps {
  stakedBooks: Book[];
  selectedBook: Book | null;
  setSelectedBook: (book: Book) => void;
  wallet: WalletContextState;
  connection: Connection;
  setErrorMessage: (message: string | null) => void;
}

const BookList: React.FC<BookListProps> = ({
  stakedBooks,
  selectedBook,
  setSelectedBook,
  wallet,
  connection,
  setErrorMessage,
}) => {
  const handleClaimReward = async (book: Book) => {
    if (wallet.publicKey && wallet.connected) {
      try {
        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKeyObj = new PublicKey(book.bookPubKey);

        const tx = await programUtils.claimStakeEarnings(bookPubKeyObj);
        console.log(`Earnings claimed. Transaction: ${tx}`);

        // Update the book in the stakedBooks state
        // ... (implement the update logic here)

        console.log("Successfully claimed reward for book");
        setErrorMessage(null);
      } catch (error) {
        console.error("Error claiming reward:", error);
        setErrorMessage("Failed to claim reward. Please try again.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const handleOffRamp = async (book: Book) => {
    // ... (implement the off-ramp logic here)
  };

  const calculateWalletEarnings = (book: Book) => {
    const walletStake = book.stakes.find(
      (stake) => stake.staker === wallet.publicKey?.toString()
    );
    return walletStake ? walletStake.earnings : 0;
  };

  return (
    <div className="w-1/3 pr-4 border-r border-[#A8DADC]">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Staked Books</h2>
      {stakedBooks.length === 0 ? (
        <p className="text-[#1D3557]">You haven't staked any books yet.</p>
      ) : (
        <ul>
          {stakedBooks.map((book) => {
            const walletEarnings = calculateWalletEarnings(book);
            const walletStake = book.stakes.find(
              (stake) => stake.staker === wallet.publicKey?.toString()
            );
            return (
              <li
                key={book.bookPubKey}
                className={`mb-4 p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedBook?.bookPubKey === book.bookPubKey
                    ? "bg-[#A8DADC]"
                    : "bg-white hover:bg-[#A8DADC]"
                }`}
                onClick={() => setSelectedBook(book)}
              >
                <h3 className="text-lg font-semibold text-[#1D3557]">
                  {book.title}
                </h3>
                <p className="text-sm text-[#457B9D]">by {book.author}</p>
                <p className="text-[#1D3557] mt-2">
                  Your Earnings: {walletEarnings / 1e9} SOL
                </p>
                <div className="flex space-x-2 mt-2">
                  {walletEarnings > 0 && (
                    <button
                      className="bg-[#457B9D] text-white px-4 py-2 rounded hover:bg-[#1D3557] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimReward(book);
                      }}
                    >
                      Claim Earnings
                    </button>
                  )}
                  {walletEarnings > 0 &&
                    walletStake &&
                    walletStake.amount > 0 && (
                      <button
                        className="bg-[#E63946] text-white px-4 py-2 rounded hover:bg-[#C1121F] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOffRamp(book);
                        }}
                      >
                        Withdraw To Bank/Credit Card
                      </button>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookList;
