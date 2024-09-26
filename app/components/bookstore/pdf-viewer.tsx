import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-viewer.module.css";
import { useBook } from "./BookContext";
import Image from "next/image";
import arrowImage from "./images/arrow_red.png";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ChapterInfo {
  index: number;
  is_purchased: boolean;
  name: string;
  chapter_content: string | null;
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

  const initialScale = 1.2;

  const { bookDetails, stakeAndPurchaseBook } = useBook();

  const [chapterInfos, setChapterInfos] = useState<ChapterInfo[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterInfo | null>(
    null
  );

  const [nextChapter, setNextChapter] = useState<ChapterInfo | null>(null);
  const [prevChapter, setPrevChapter] = useState<ChapterInfo | null>(null);

  if (!bookDetails) {
    return <div>No book details available</div>;
  }

  const {
    title,
    author,
    chapterPrices,
    fullBookPrice,
    totalStake,
    chapters,
    stakes,
    image,
  } = bookDetails;

  const allChaptersPurchased = chapterInfos.every(
    (chapter) => chapter.is_purchased
  );

  useEffect(() => {
    const fetchChapterInfos = async () => {
      try {
        const chapterInfoPromises = chapters.map((chapterUrl) =>
          fetch(chapterUrl).then((res) => res.json())
        );
        const chaptersData = await Promise.all(chapterInfoPromises);
        setChapterInfos(chaptersData);
      } catch (error) {
        console.error("Error fetching chapter information:", error);
        setError("Failed to fetch chapter information");
      }
    };

    fetchChapterInfos();
  }, [chapters]);

  const handleChapterSelect = (chapter: ChapterInfo) => {
    if (chapter.is_purchased) {
      setSelectedChapter(chapter);
      setPdfURL(chapter.chapter_content);
      setPageNumber(1);
      setNumPages(null);
      setPdfKey((prevKey) => prevKey + 1);
    } else {
      console.log(`Bought chapter ${chapter.index}`);
      // Here you would typically make an API call to purchase the chapter
      // For now, we'll just update the local state
      setChapterInfos((prevChapters) =>
        prevChapters.map((ch) =>
          ch.index === chapter.index ? { ...ch, is_purchased: true } : ch
        )
      );
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
      const currentIndex = chapterInfos.findIndex(
        (ch) => ch.index === selectedChapter.index
      );

      if (currentIndex > 0) {
        setPrevChapter(chapterInfos[currentIndex - 1]);
      } else {
        setPrevChapter(null);
      }

      if (currentIndex < chapterInfos.length - 1) {
        setNextChapter(chapterInfos[currentIndex + 1]);
      } else {
        setNextChapter(null);
      }
    } else {
      setPrevChapter(null);
      setNextChapter(null);
    }
  }, [selectedChapter, chapterInfos]);

  const handlePurchaseWholeBook = () => {
    if (bookDetails) {
      stakeAndPurchaseBook(bookDetails.id);
      console.log("Purchasing whole book:", bookDetails.id);
    }
  };

  const handleStakeClick = () => {
    if (!allChaptersPurchased) {
      setShowStakeTooltip(true);
      setTimeout(() => setShowStakeTooltip(false), 3000); // Hide tooltip after 3 seconds
    } else if (bookDetails) {
      stakeAndPurchaseBook(bookDetails.id);
      console.log("Staking for book:", bookDetails.id);
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <button onClick={handleGoBack} className={styles.backButton}>
            ←
          </button>
          <h2 className={styles.bookTitle}>{title}</h2>
        </div>
        <div className={styles.chapterList}>
          {chapterInfos.map((chapter) => (
            <div key={chapter.index} className={styles.chapterItem}>
              <span>{chapter.name}</span>
              <button
                onClick={() => handleChapterSelect(chapter)}
                className={
                  chapter.is_purchased ? styles.readButton : styles.buyButton
                }
              >
                {chapter.is_purchased ? "Read" : "Buy"}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.sidebarFooter}>
          {!allChaptersPurchased && (
            <button
              onClick={handlePurchaseWholeBook}
              className={styles.purchaseButton}
            >
              Purchase Whole Book
            </button>
          )}
          <div className={styles.stakeButtonWrapper}>
            <button
              onClick={handleStakeClick}
              onMouseEnter={() =>
                !allChaptersPurchased && setShowStakeTooltip(true)
              }
              onMouseLeave={() => setShowStakeTooltip(false)}
              className={`${styles.stakeButton} ${
                !allChaptersPurchased ? styles.disabledStake : ""
              }`}
              disabled={!allChaptersPurchased}
            >
              Stake
            </button>
            {showStakeTooltip && !allChaptersPurchased && (
              <div className={styles.stakeTooltip}>
                All chapters must be purchased before staking
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.pdfContainer}>
        {!selectedChapter && (
          <div className={styles.instructions}>
            <Image
              src={arrowImage}
              alt="Arrow pointing to sidebar"
              className={styles.instructionArrow}
              width={100}
              height={100}
            />
            <span className={styles.instructionText}>
              Select a chapter from the sidebar to start reading
            </span>
          </div>
        )}
        {selectedChapter && selectedChapter.is_purchased && pdfURL ? (
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
            {selectedChapter && !selectedChapter.is_purchased
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
                prevChapter.is_purchased ? styles.readButton : styles.buyButton
              }
            >
              {prevChapter.is_purchased ? "Read Prev" : "Buy Prev"}
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
                nextChapter.is_purchased ? styles.readButton : styles.buyButton
              }
            >
              {nextChapter.is_purchased ? "Read Next" : "Buy Next"}
            </button>
          )}
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}

      {/* Update the debug info */}
      <div className={styles.debugInfo}>
        <p>Is Last Page: {isLastPage ? "Yes" : "No"}</p>
        <p>Next PDF URL: {pdfURL || "None"}</p>
        <p>
          Next Chapter Purchased: {selectedChapter?.is_purchased ? "Yes" : "No"}
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
