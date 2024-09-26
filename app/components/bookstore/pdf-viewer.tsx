import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-viewer.module.css";
import next from "next";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isControlBarMinimized, setIsControlBarMinimized] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [pdfURL, setPdfURL] = useState<string | null>(pdfUrl);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nextPdfURL, setNextPdfURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chapterInfo, setChapterInfo] = useState<{
    chapter: number;
    purchased: boolean;
  } | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [nextChapterPurchased, setNextChapterPurchased] =
    useState<boolean>(false);

  const initialScale = 1.2;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page when a new document is loaded
    setIsLastPage(1 === numPages);
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

  const fetchNextPdfURL = async () => {
    try {
      console.log("Fetching next PDF URL...");
      const response = await fetch("http://localhost:8000/chapter-info");
      const data = await response.json();
      console.log("Received chapter info:", data);

      if (data.url) {
        setNextPdfURL("http://localhost:8000/" + data.url);
        console.log("Next PDF URL set:", "http://localhost:8000/" + data.url);
      }

      setChapterInfo({
        chapter: data.chapter,
        purchased: data.purchased,
      });
      setNextChapterPurchased(data.purchased);
      console.log("Next chapter info:", {
        chapter: data.chapter,
        purchased: data.purchased,
      });
      console.log("Next chapter purchased:", data.purchased);

      setError(null);
    } catch (error) {
      console.error("Error fetching next PDF URL:", error);
      setError("Failed to fetch next PDF information");
    }
  };

  useEffect(() => {
    if (isLastPage && !nextPdfURL) {
      console.log("Last page reached, fetching next PDF URL");
      fetchNextPdfURL();
    }
  }, [isLastPage, nextPdfURL, pdfURL]);

  const loadNextPdf = () => {
    console.log("Loading next PDF...");
    console.log("Next PDF URL:", nextPdfURL);
    if (nextPdfURL) {
      setPdfURL(nextPdfURL);
      setPageNumber(1);
      setNumPages(null);
      setNextPdfURL(null);
      setPdfKey((prevKey) => prevKey + 1);
      console.log("Next PDF loaded. New PDF URL:", nextPdfURL);
    }
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const resetZoom = () => setScale(initialScale);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setScale(Math.min(clientWidth / 600, clientHeight / 800));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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

  // Add this useEffect to handle invalid PDF URLs
  useEffect(() => {
    const checkPdfUrl = async () => {
      try {
        const response = await fetch(pdfUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error("PDF not found");
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        setError(
          "Failed to load PDF. The file might not exist or you may not have permission to view it."
        );
        setPdfURL(null);
      }
    };

    checkPdfUrl();
  }, [pdfUrl]);

  const handleGoBack = () => {
    // Use window.history instead of router
    window.history.back();
  };

  const handlePurchase = () => {
    console.log("Purchase button clicked");
    // Implement the purchase logic here
    console.log("Purchase functionality to be implemented");
    // After successful purchase, update the state
    setNextChapterPurchased(true);
    console.log("Next chapter marked as purchased");
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.backButtonContainer}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Back
        </button>
      </div>
      <div
        className={`${styles.controlBar} ${
          isControlBarMinimized ? styles.minimized : ""
        }`}
      >
        <button
          onClick={() => setIsControlBarMinimized(!isControlBarMinimized)}
          className={styles.toggleButton}
        >
          {isControlBarMinimized ? "▲" : "▼"}
        </button>
        <div className={styles.controlsWrapper}>
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className={styles.button}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 1)}
            className={styles.button}
          >
            Next
          </button>
          <button onClick={zoomOut} className={styles.button}>
            Zoom Out
          </button>
          <button onClick={zoomIn} className={styles.button}>
            Zoom In
          </button>
          {isLastPage && nextPdfURL && (
            <>
              {nextChapterPurchased ? (
                <button onClick={loadNextPdf} className={styles.button}>
                  Next Chapter
                </button>
              ) : (
                <button onClick={handlePurchase} className={styles.button}>
                  Purchase Next Chapter
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className={styles.pdfWrapper}>
        {pdfURL ? (
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
          <div className={styles.error}>No valid PDF URL provided</div>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {/* <div className={styles.currentUrl}>Current PDF URL: {pdfURL}</div> */}
      {/* {isLastPage && nextPdfURL && (
        <>
          {nextChapterPurchased ? (
            <button onClick={loadNextPdf} className={styles.button}>
              Next Chapter
            </button>
          ) : (
            <button onClick={handlePurchase} className={styles.button}>
              Purchase Next Chapter
            </button>
          )}
        </>
      )} */}
      {/* Add this debug information */}
      <div className={styles.debugInfo}>
        <p>Is Last Page: {isLastPage ? "Yes" : "No"}</p>
        <p>Next PDF URL: {nextPdfURL || "None"}</p>
        <p>Next Chapter Purchased: {nextChapterPurchased ? "Yes" : "No"}</p>
        <p>Chapter Info: {JSON.stringify(chapterInfo)}</p>
      </div>
    </div>
  );
};

export default PDFViewer;
