// Sidebar.tsx
import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ProgramUtils } from "../../utils/programUtils";
import styles from "./pdf-viewer.module.css";

interface SidebarProps {
  bookDetails: any;
  selectedChapter: any;
  onChapterSelect: (chapter: any) => void;
  onGoBack: () => void;
  onStake: () => void;
  onBookUpdate: (updatedBook: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  bookDetails,
  selectedChapter,
  onChapterSelect,
  onGoBack,
  onStake,
  onBookUpdate,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [purchasingChapter, setPurchasingChapter] = useState<number | null>(
    null
  );
  const [purchasingBook, setPurchasingBook] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChaptersPurchased = bookDetails.chapters.every((chapter: any) =>
    bookDetails.userOwnership.chaptersPurchased.includes(chapter.index)
  );

  const handlePurchaseChapter = async (chapter: any) => {
    if (!wallet.connected) {
      setError("Please connect your wallet to make a purchase.");
      return;
    }

    try {
      setPurchasingChapter(chapter.index);
      const programUtils = new ProgramUtils(connection, wallet);
      const bookPubKey = new PublicKey(bookDetails.bookPubKey);
      const authorPubKey = new PublicKey(bookDetails.author);

      await programUtils.initializeCollectionPubKey();
      console.log("programUtils:::: ", programUtils.collectionPubKey);

      const tx = await programUtils.purchaseChapter(
        bookPubKey,
        authorPubKey,
        chapter.index
      );

      console.log(`Chapter ${chapter.index} purchased. Transaction: ${tx}`);

      const updatedBookInfo = await programUtils.fetchBook(bookPubKey);
      onBookUpdate(updatedBookInfo);
      onChapterSelect(chapter);
    } catch (error) {
      console.error("Error purchasing chapter:", error);
      setError("Failed to purchase chapter. Please try again.");
    } finally {
      setPurchasingChapter(null);
    }
  };

  const handlePurchaseBook = async () => {
    if (!wallet.connected) {
      setError("Please connect your wallet to make a purchase.");
      return;
    }

    try {
      setPurchasingBook(true);
      const programUtils = new ProgramUtils(connection, wallet);
      const bookPubKey = new PublicKey(bookDetails.bookPubKey);
      const authorPubKey = new PublicKey(bookDetails.author);

      const tx = await programUtils.purchaseFullBook(bookPubKey, authorPubKey);
      console.log(`Full book purchased. Transaction: ${tx}`);

      const updatedBookInfo = await programUtils.fetchBook(bookPubKey);
      onBookUpdate(updatedBookInfo);
    } catch (error) {
      console.error("Error purchasing book:", error);
      setError("Failed to purchase the book. Please try again.");
    } finally {
      setPurchasingBook(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <button onClick={onGoBack} className={styles.backButton}>
          ←
        </button>
        <h2 className={styles.bookTitle}>{bookDetails.title}</h2>
      </div>
      <div className={styles.chapterList}>
        {bookDetails.chapters.map((chapter: any) => (
          <div key={chapter.index} className={styles.chapterItem}>
            <span>{chapter.name}</span>
            <button
              onClick={() =>
                bookDetails.userOwnership.chaptersPurchased.includes(
                  chapter.index
                )
                  ? onChapterSelect(chapter)
                  : handlePurchaseChapter(chapter)
              }
              className={
                bookDetails.userOwnership.chaptersPurchased.includes(
                  chapter.index
                )
                  ? styles.readButton
                  : styles.buyButton
              }
              disabled={purchasingChapter === chapter.index}
            >
              {bookDetails.userOwnership.chaptersPurchased.includes(
                chapter.index
              )
                ? "Read"
                : purchasingChapter === chapter.index
                ? "Purchasing..."
                : `${chapter.price / 1e9} SOL`}
            </button>
          </div>
        ))}
      </div>
      <div className={styles.sidebarFooter}>
        {!bookDetails.userOwnership.bookPurchased && (
          <button
            onClick={handlePurchaseBook}
            className={styles.purchaseButton}
            disabled={purchasingBook}
          >
            {purchasingBook
              ? "Purchasing..."
              : `Purchase Full Book (${bookDetails.fullBookPrice / 1e9} SOL)`}
          </button>
        )}
        <button
          onClick={onStake}
          className={`${styles.stakeButton} ${
            !allChaptersPurchased ? styles.disabledStake : ""
          }`}
          disabled={!allChaptersPurchased}
        >
          {bookDetails.userOwnership.amount > 0 ? "View Stake" : "Stake"}
          {!allChaptersPurchased && (
            <span className={styles.stakeSubheading}>
              (must be purchased first)
            </span>
          )}
        </button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Sidebar;
