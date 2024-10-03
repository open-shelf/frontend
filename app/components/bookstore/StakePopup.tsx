import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ProgramUtils } from "../../utils/programUtils";

interface StakePopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookPubKey: string;
  stakes: {
    staker: string;
    amount: number;
    earnings: number;
  }[];
  onStakeSuccess: (updatedBookInfo: any) => void;
  totalStake: number;
}

export default function StakePopup({
  isOpen,
  onClose,
  bookPubKey,
  stakes,
  onStakeSuccess,
  totalStake,
}: StakePopupProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [isUserStaked, setIsUserStaked] = useState(false);
  const [userStakeAmount, setUserStakeAmount] = useState<number>(0);
  const [userRewards, setUserRewards] = useState<number>(0);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [potentialEarnings, setPotentialEarnings] = useState<number>(0);

  useEffect(() => {
    if (stakes && wallet.publicKey) {
      const userStake = stakes.find(
        (stake: { staker: string; amount: number; earnings: number }) =>
          stake.staker === wallet.publicKey?.toString()
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

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserStaked && bookPubKey) {
      try {
        if (!wallet.connected) {
          throw new Error("Wallet not connected");
        }

        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKeyObj = new PublicKey(bookPubKey);
        const stakeAmountLamports = Math.floor(parseFloat(stakeAmount) * 1e9);

        const tx = await programUtils.stakeOnBook(
          bookPubKeyObj,
          stakeAmountLamports
        );
        console.log(`Staked on book. Transaction: ${tx}`);

        await new Promise((f) => setTimeout(f, 5000));

        const updatedBookInfo = await programUtils.fetchBook(bookPubKeyObj);

        onStakeSuccess(updatedBookInfo);

        const userStake = updatedBookInfo.stakes.find(
          (stake: { staker: string; amount: number; earnings: number }) =>
            stake.staker === wallet.publicKey?.toString()
        );

        if (userStake) {
          setIsUserStaked(true);
          setUserStakeAmount(userStake.amount);
          setUserRewards(0);
        }

        console.log("Successfully staked on book");
      } catch (error) {
        console.error("Error staking on book:", error);
        setError("Failed to stake on the book");
      }
    }
    onClose();
  };

  const handleClaimReward = async () => {
    if (bookPubKey && wallet.connected && userRewards > 0) {
      try {
        setIsClaimingReward(true);
        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKeyObj = new PublicKey(bookPubKey);

        const tx = await programUtils.claimStakeEarnings(bookPubKeyObj);
        console.log(`Earning claimed. Transaction: ${tx}`);

        await new Promise((f) => setTimeout(f, 5000));

        const updatedBookInfo = await programUtils.fetchBook(bookPubKeyObj);

        onStakeSuccess(updatedBookInfo);

        const userStake = updatedBookInfo.stakes.find(
          (stake: { staker: string | undefined }) =>
            stake.staker === wallet.publicKey?.toString()
        );

        if (userStake) {
          setUserStakeAmount(userStake.amount);
          setUserRewards(0);
        } else {
          setUserStakeAmount(0);
          setUserRewards(0);
        }

        console.log("Successfully claimed reward for book");
      } catch (error) {
        console.error("Error claiming reward:", error);
        setError("Failed to claim reward");
      } finally {
        setIsClaimingReward(false);
      }
    }
  };

  const calculatePotentialEarnings = (amount: number) => {
    const hypotheticalEarnings = 1000; // 1000 SOL
    const userStakePercentage = amount / (totalStake + amount);
    return hypotheticalEarnings * userStakePercentage * 0.15;
  };

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setStakeAmount(e.target.value);
    if (!isNaN(amount)) {
      const earnings = calculatePotentialEarnings(amount * 1e9); // Convert SOL to lamports
      setPotentialEarnings(earnings);
    } else {
      setPotentialEarnings(0);
    }
  };

  const averageStake = stakes.length > 0 ? totalStake / stakes.length / 1e9 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors text-xl"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-[#1D3557] border-b pb-2">
          {isUserStaked ? "Your Stake Details" : "Stake SOL"}
        </h3>
        <div className="mb-4 bg-gray-100 p-3 rounded-lg text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">Total Stakers:</span>{" "}
            {stakes.length}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total Stake:</span>{" "}
            {(totalStake / 1e9).toFixed(2)} SOL
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Avg Stake:</span>{" "}
            {(totalStake / stakes.length / 1e9).toFixed(2)} SOL
          </p>
        </div>
        {isUserStaked ? (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Your Stake:</span>{" "}
              {(userStakeAmount / 1e9).toFixed(2)} SOL
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Your Rewards:</span>{" "}
              {(userRewards / 1e9).toFixed(2)} SOL
            </p>
            {userRewards > 0 && (
              <button
                onClick={handleClaimReward}
                disabled={isClaimingReward}
                className="bg-[#1D3557] text-white px-4 py-1 rounded-full hover:bg-[#2A4A6D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm"
              >
                {isClaimingReward ? "Claiming..." : "Claim Reward"}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleStakeSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <input
                type="number"
                value={stakeAmount}
                onChange={handleStakeAmountChange}
                placeholder="Enter stake amount"
                min="0"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D3557] text-sm"
              />
              <span className="absolute right-3 text-gray-500 pointer-events-none text-sm">
                SOL
              </span>
            </div>
            {potentialEarnings > 0 && (
              <div className="bg-green-50 p-2 rounded-lg text-xs">
                <p className="text-gray-700">
                  <span className="font-semibold">Potential Earnings:</span>{" "}
                  {potentialEarnings.toFixed(2)} SOL (if book earns 1000 SOL)
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#1D3557] text-white px-4 py-1 rounded-full hover:bg-[#2A4A6D] transition-colors text-sm"
              >
                Stake
              </button>
            </div>
          </form>
        )}
        {error && (
          <div className="mt-2 text-red-500 bg-red-50 p-2 rounded text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
