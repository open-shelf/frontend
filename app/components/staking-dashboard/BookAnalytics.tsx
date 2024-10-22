import React from "react";
import { Book } from "../../utils/programUtils";
import StakeDistributionChart from "./StakeDistributionChart";
import EarningsChart from "./EarningsChart";
import { WalletContextState } from "@solana/wallet-adapter-react";

interface BookAnalyticsProps {
  selectedBook: Book | null;
  wallet: WalletContextState;
}

const BookAnalytics: React.FC<BookAnalyticsProps> = ({
  selectedBook,
  wallet,
}) => {
  const calculateTotalStake = (book: Book) => {
    return book.stakes.reduce((sum, stake) => sum + stake.amount, 0);
  };

  const calculateTotalEarnings = (book: Book) => {
    return book.stakes.reduce((sum, stake) => sum + stake.earnings, 0);
  };

  const calculateAverageStake = (book: Book) => {
    const totalStake = calculateTotalStake(book);
    return book.stakes.length > 0 ? totalStake / book.stakes.length : 0;
  };

  if (!selectedBook) {
    return (
      <div className="w-2/3 pl-4">
        <p className="text-[#1D3557]">Select a book to view its analytics.</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 pl-4">
      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
        {selectedBook.title} Analytics
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-[#457B9D]">Total Stake</p>
          <p className="text-xl font-semibold text-[#1D3557]">
            {calculateTotalStake(selectedBook) / 1e9} SOL
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-[#457B9D]">Total Earnings</p>
          <p className="text-xl font-semibold text-[#1D3557]">
            {calculateTotalEarnings(selectedBook) / 1e9} SOL
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-[#457B9D]">Number of Stakers</p>
          <p className="text-xl font-semibold text-[#1D3557]">
            {selectedBook.stakes.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-[#457B9D]">Average Stake</p>
          <p className="text-xl font-semibold text-[#1D3557]">
            {(calculateAverageStake(selectedBook) / 1e9).toFixed(4)} SOL
          </p>
        </div>
      </div>

      <StakeDistributionChart selectedBook={selectedBook} />
      <EarningsChart selectedBook={selectedBook} wallet={wallet} />
    </div>
  );
};

export default BookAnalytics;
