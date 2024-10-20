// PDFViewer.tsx
import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../../utils/programUtils";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./pdf-viewer.module.css";
import Sidebar from "./Sidebar";
import PDFContent from "./PDFContent";
import ControlBar from "./ControlBar";
import StakePopup from "../bookstore/StakePopup";
import ErrorOverlay from "./ErrorOverlay";

interface PDFViewerProps {
  bookPubKey: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ bookPubKey }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.7);
  const [isSideBySide, setIsSideBySide] = useState(false);

  const handleScaleUpdate = (newScale: number) => {
    setScale(newScale);
  };

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  const toggleSideBySide = () => {
    setIsSideBySide((prev) => !prev);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (bookPubKey) {
        try {
          const programUtils = new ProgramUtils(connection, wallet);
          const pubKey = new PublicKey(bookPubKey);
          const book = await programUtils.fetchBook(pubKey);
          setBookDetails(book);
          if (book.chapters.length > 0) {
            setSelectedChapter(book.chapters[0]);
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
          setError("Failed to load book details. Please try again later.");
        }
      }
    };

    fetchBookDetails();
  }, [bookPubKey, connection, wallet]);

  const handleChapterSelect = (chapter: any) => {
    setSelectedChapter(chapter);
  };

  const handleStakeSuccess = (updatedBookInfo: any) => {
    setBookDetails(updatedBookInfo);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleBookUpdate = (updatedBook: any) => {
    setBookDetails(updatedBook);

    // If the selected chapter was just purchased, update it
    if (
      selectedChapter &&
      updatedBook.userOwnership.chaptersPurchased.includes(
        selectedChapter.index
      )
    ) {
      const updatedChapter = updatedBook.chapters.find(
        (ch: any) => ch.index === selectedChapter.index
      );
      if (updatedChapter) {
        setSelectedChapter(updatedChapter);
      }
    }

    // If no chapter is selected or the selected chapter is not purchased, select the first purchased chapter
    if (
      !selectedChapter ||
      !updatedBook.userOwnership.chaptersPurchased.includes(
        selectedChapter.index
      )
    ) {
      const firstPurchasedChapter = updatedBook.chapters.find((ch: any) =>
        updatedBook.userOwnership.chaptersPurchased.includes(ch.index)
      );
      if (firstPurchasedChapter) {
        setSelectedChapter(firstPurchasedChapter);
      }
    }
  };

  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.walletWidgetContainer}>
        <WalletMultiButton />
      </div>
      <Sidebar
        bookDetails={bookDetails}
        selectedChapter={selectedChapter}
        onChapterSelect={handleChapterSelect}
        onGoBack={handleGoBack}
        onStake={() => setIsStakePopupOpen(true)}
        onBookUpdate={handleBookUpdate}
      />
      <PDFContent
        selectedChapter={selectedChapter}
        bookDetails={bookDetails}
        numPages={numPages}
        pageNumber={pageNumber}
        scale={scale}
        isSideBySide={isSideBySide}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      />
      <ControlBar
        selectedChapter={selectedChapter}
        onChapterSelect={handleChapterSelect}
        bookDetails={bookDetails}
        numPages={numPages}
        pageNumber={pageNumber}
        onPageChange={handlePageChange}
        scale={scale}
        onScaleChange={handleScaleChange}
        isSideBySide={isSideBySide}
        onToggleSideBySide={toggleSideBySide}
      />
      {error && <ErrorOverlay message={error} />}
      <StakePopup
        isOpen={isStakePopupOpen}
        onClose={() => setIsStakePopupOpen(false)}
        bookPubKey={bookDetails.bookPubKey}
        stakes={bookDetails.stakes}
        onStakeSuccess={handleStakeSuccess}
        totalStake={bookDetails.totalStake}
      />
    </div>
  );
};

export default PDFViewer;
