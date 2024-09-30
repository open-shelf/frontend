import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-viewer.module.css";
import { useBook } from "./BookContext";
import Image from "next/image";
import arrowImage from "./images/arrow_red.png";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ProgramUtils } from "../../utils/programUtils";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Chapter {
  index: number;
  isPurchased: boolean;
  name: string;
  url: string;
  price: number;
}

const PDFViewer = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isControlBarMinimized, setIsControlBarMinimized] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [showStakeTooltip, setShowStakeTooltip] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const initialScale = 1.2;

  const { bookDetails, setBookDetails, stakeAndPurchaseBook } = useBook();

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [purchasingChapterIndex, setPurchasingChapterIndex] = useState<
    number | null
  >(null);

  const [chapters, setChapters] = useState<Chapter[]>(
    bookDetails?.chapters || []
  );

  const [isPurchasingWholeBook, setIsPurchasingWholeBook] = useState(false);

  if (!bookDetails) {
    return <div>No book details available</div>;
  }

  const { title, author, fullBookPrice, totalStake, stakes, image } =
    bookDetails;

  const allChaptersPurchased = chapters.every((chapter) => chapter.isPurchased);

  useEffect(() => {
    if (chapters.length > 0) {
      setSelectedChapter(chapters[0]);
      setPdfURL(chapters[0].url);
    }
  }, [chapters]);

  const handleChapterSelect = async (chapter: Chapter) => {
    if (chapter.isPurchased) {
      setSelectedChapter(chapter);
      setPdfURL(chapter.url);
      setPageNumber(1);
      setNumPages(null);
      setPdfKey((prevKey) => prevKey + 1);
    } else {
      try {
        setPurchasingChapterIndex(chapter.index);

        if (!wallet.connected) {
          throw new Error("Wallet is not connected");
        }

        console.log("Book public key:", bookDetails.bookPubKey);
        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKey = new PublicKey(bookDetails.bookPubKey);
        const authorPubKey = new PublicKey(bookDetails.author);

        const tx = await programUtils.purchaseChapter(
          bookPubKey,
          authorPubKey,
          chapter.index
        );

        console.log(`Chapter ${chapter.index} purchased. Transaction: ${tx}`);

        const updatedBookInfo = await programUtils.fetchBook(bookPubKey);

        console.log("updated book info", updatedBookInfo);
        // Update the local state with the new book info
        setBookDetails({
          ...updatedBookInfo,
        });

        // Update the chapters state with the newly purchased chapter
        const updatedChapters = chapters.map((ch) =>
          ch.index === chapter.index ? { ...ch, isPurchased: true } : ch
        );
        setChapters(updatedChapters);

        // Set the newly purchased chapter as the selected chapter
        const updatedChapter = { ...chapter, isPurchased: true };
        setSelectedChapter(updatedChapter);
        setPdfURL(updatedChapter.url);
        setPageNumber(1);
        setNumPages(null);
        setPdfKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Error purchasing chapter:", error);

        // Extract only the error message
        let errorMessage = "Failed to purchase chapter";
        if (error instanceof Error) {
          const match = error.message.match(/Error Message: (.+)$/);
          if (match) {
            errorMessage = match[1];
          }
        }

        setError(errorMessage);
      } finally {
        setPurchasingChapterIndex(null);
      }
    }
  };

  const calculateScale = () => {
    if (containerRef.current && pdfDimensions.width && pdfDimensions.height) {
      const containerWidth = containerRef.current.clientWidth - 60; // Increased padding
      const containerHeight = containerRef.current.clientHeight - 50; // Increased padding

      const widthScale = containerWidth / pdfDimensions.width;
      const heightScale = containerHeight / pdfDimensions.height;

      // Use the smaller scale to ensure the entire page fits
      const newScale = Math.min(widthScale, heightScale, 2); // Reduced max zoom to 1.2x

      // Apply a factor to make it slightly smaller
      const adjustedScale = newScale * 0.9;

      setScale(adjustedScale);
    }
  };

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [pdfDimensions]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLastPage(1 === numPages);

    // Get the dimensions of the first page
    if (pdfURL) {
      pdfjs.getDocument(pdfURL).promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          setPdfDimensions({ width: viewport.width, height: viewport.height });
        });
      });
    }
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber =
        prevPageNumber + (isSideBySide ? offset * 2 : offset);

      const updatedPageNumber = Math.max(
        1,
        Math.min(newPageNumber, numPages || 1)
      );

      // Check if we're on the last page
      setIsLastPage(updatedPageNumber === numPages);

      return updatedPageNumber;
    });
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const resetZoom = () => setScale(initialScale);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        changePage(-1);
      } else if (e.key === "ArrowRight") {
        changePage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, pageNumber, isSideBySide]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const toggleSideBySide = () => {
    setIsSideBySide((prev) => !prev);
    setPageNumber((prevPageNumber) => {
      if (!isSideBySide) {
        return prevPageNumber % 2 === 0 ? prevPageNumber - 1 : prevPageNumber;
      } else {
        return prevPageNumber;
      }
    });
  };

  const handleGoBack = () => {
    // Use window.history instead of router
    window.history.back();
  };

  useEffect(() => {
    if (selectedChapter) {
      const currentIndex = chapters.findIndex(
        (ch) => ch.index === selectedChapter.index
      );

      if (currentIndex > 0) {
        setPrevChapter(chapters[currentIndex - 1]);
      } else {
        setPrevChapter(null);
      }

      if (currentIndex < chapters.length - 1) {
        setNextChapter(chapters[currentIndex + 1]);
      } else {
        setNextChapter(null);
      }
    } else {
      setPrevChapter(null);
      setNextChapter(null);
    }
  }, [selectedChapter, chapters]);

  const handlePurchaseWholeBook = async () => {
    if (bookDetails) {
      try {
        setIsPurchasingWholeBook(true);

        if (!wallet.connected) {
          throw new Error("Wallet is not connected");
        }

        const programUtils = new ProgramUtils(connection, wallet);
        const bookPubKey = new PublicKey(bookDetails.bookPubKey);
        const authorPubKey = new PublicKey(bookDetails.author);

        // Purchase the whole book
        const tx = await programUtils.purchaseFullBook(
          bookPubKey,
          authorPubKey
        );
        console.log(`Whole book purchased. Transaction: ${tx}`);

        // Fetch updated book info
        const updatedBookInfo = await programUtils.fetchBook(bookPubKey);

        // Update the local state with the new book info
        setBookDetails({
          ...updatedBookInfo,
        });

        // Update all chapters to be purchased
        const updatedChapters = chapters.map((ch) => ({
          ...ch,
          isPurchased: true,
        }));
        setChapters(updatedChapters);

        // Set the first chapter as the selected chapter
        setSelectedChapter(updatedChapters[0]);
        setPdfURL(updatedChapters[0].url);
        setPageNumber(1);
        setNumPages(null);
        setPdfKey((prevKey) => prevKey + 1);

        console.log("Whole book purchased successfully:", bookDetails.title);
      } catch (error) {
        console.error("Error purchasing whole book:", error);
        let errorMessage = "Failed to purchase the whole book";
        if (error instanceof Error) {
          const match = error.message.match(/Error Message: (.+)$/);
          if (match) {
            errorMessage = match[1];
          }
        }
        setError(errorMessage);
      } finally {
        setIsPurchasingWholeBook(false);
      }
    }
  };

  const handleStakeClick = () => {
    if (allChaptersPurchased && bookDetails) {
      stakeAndPurchaseBook(bookDetails.title);
      console.log("Staking for book:", bookDetails.title);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Error message will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.walletWidgetContainer}>
        <WalletMultiButton />
      </div>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <button onClick={handleGoBack} className={styles.backButton}>
            ←
          </button>
          <h2 className={styles.bookTitle}>{title}</h2>
        </div>
        <div className={styles.chapterList}>
          {chapters.map((chapter) => (
            <div key={chapter.index} className={styles.chapterItem}>
              <span>{chapter.name}</span>
              <button
                onClick={() => handleChapterSelect(chapter)}
                className={
                  chapter.isPurchased ? styles.readButton : styles.buyButton
                }
                disabled={purchasingChapterIndex === chapter.index}
              >
                {chapter.isPurchased
                  ? "Read"
                  : purchasingChapterIndex === chapter.index
                  ? "Purchasing..."
                  : `Buy (${chapter.price / 1e9} SOL)`}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.sidebarFooter}>
          {!allChaptersPurchased && (
            <button
              onClick={handlePurchaseWholeBook}
              className={styles.purchaseButton}
              disabled={isPurchasingWholeBook}
            >
              {isPurchasingWholeBook ? "Purchasing..." : `Purchase Full Book`}
            </button>
          )}
          <button
            onClick={handleStakeClick}
            className={`${styles.stakeButton} ${
              !allChaptersPurchased ? styles.disabledStake : ""
            }`}
            disabled={!allChaptersPurchased}
          >
            Stake
            {!allChaptersPurchased && (
              <span className={styles.stakeSubheading}>
                (must be purchased first)
              </span>
            )}
          </button>
        </div>
      </div>
      <div className={styles.pdfContainer}>
        {selectedChapter && selectedChapter.isPurchased && pdfURL ? (
          <Document
            key={pdfKey}
            file={pdfURL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Loading PDF...</p>}
            error={<p>Failed to load PDF. Please try again later.</p>}
            options={{
              cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
              cMapPacked: true,
            }}
          >
            <div className={styles.pdfContent}>
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              {isSideBySide && pageNumber + 1 <= (numPages || 1) && (
                <>
                  <div className={styles.pageSeparator} />
                  <Page
                    pageNumber={pageNumber + 1}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </>
              )}
            </div>
          </Document>
        ) : (
          <div className={styles.instructions}>
            {selectedChapter && !selectedChapter.isPurchased
              ? "Please purchase this chapter to read it."
              : "Select a chapter from the sidebar to start reading."}
          </div>
        )}
      </div>

      <div
        className={`${styles.controlBar} ${
          isControlBarMinimized ? styles.minimized : ""
        }`}
      >
        <button
          onClick={() => setIsControlBarMinimized(!isControlBarMinimized)}
          className={`${styles.toggleButton} ${
            isControlBarMinimized ? styles.toggleButtonMinimized : ""
          }`}
        >
          {isControlBarMinimized ? "▲" : "▼"}
        </button>
        <div className={styles.controlsWrapper}>
          {prevChapter && (
            <button
              onClick={() => handleChapterSelect(prevChapter)}
              className={
                prevChapter.isPurchased ? styles.readButton : styles.buyButton
              }
            >
              {prevChapter.isPurchased ? "Read Prev" : "Buy Prev"}
            </button>
          )}
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className={styles.button}
          >
            ←
          </button>
          <span className={styles.pageInfo}>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 1)}
            className={styles.button}
          >
            →
          </button>
          <button onClick={zoomOut} className={styles.button}>
            -
          </button>
          <button onClick={zoomIn} className={styles.button}>
            +
          </button>
          <button onClick={toggleSideBySide} className={styles.button}>
            {isSideBySide ? "Single" : "Double"}
          </button>
          {nextChapter && (
            <button
              onClick={() => handleChapterSelect(nextChapter)}
              className={
                nextChapter.isPurchased ? styles.readButton : styles.buyButton
              }
            >
              {nextChapter.isPurchased ? "Read Next" : "Buy Next"}
            </button>
          )}
        </div>
      </div>
      {error && <div className={styles.errorOverlay}>{error}</div>}

      <div className={styles.debugInfo}>
        <p>Is Last Page: {isLastPage ? "Yes" : "No"}</p>
        <p>Current PDF URL: {pdfURL || "None"}</p>
        <p>
          Current Chapter Purchased:{" "}
          {selectedChapter?.isPurchased ? "Yes" : "No"}
        </p>
        <p>
          PDF Dimensions: {pdfDimensions.width}x{pdfDimensions.height}
        </p>
        <p>Current Scale: {scale.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PDFViewer;
