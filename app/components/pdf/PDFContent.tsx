import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-viewer.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFContentProps {
  selectedChapter: any;
  bookDetails: any;
  numPages: number | null;
  pageNumber: number;
  scale: number;
  isSideBySide: boolean;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const PDFContent: React.FC<PDFContentProps> = ({
  selectedChapter,
  bookDetails,
  numPages,
  pageNumber,
  scale,
  isSideBySide,
  onLoadSuccess,
}) => {
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateScale = () => {
    if (containerRef.current && pdfDimensions.width && pdfDimensions.height) {
      const containerWidth = containerRef.current.clientWidth - 60;
      const containerHeight = containerRef.current.clientHeight - 50;
      const widthScale = containerWidth / pdfDimensions.width;
      const heightScale = containerHeight / pdfDimensions.height;
      const newScale = Math.min(widthScale, heightScale, 2);
      return newScale * 0.9;
    }
    return scale;
  };

  useEffect(() => {
    const handleResize = () => {
      const newScale = calculateScale();
      // You might want to call a function to update the scale in the parent component here
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pdfDimensions]);

  useEffect(() => {
    if (selectedChapter) {
      pdfjs.getDocument(selectedChapter.url).promise.then((pdf: Document) => {
        pdf.getPage(1).then((page: Page) => {
          const viewport = page.getViewport({ scale: 1 });
          setPdfDimensions({ width: viewport.width, height: viewport.height });
        });
      });
    }
  }, [selectedChapter]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onLoadSuccess({ numPages });
  };

  if (
    !selectedChapter ||
    !bookDetails.userOwnership.chaptersPurchased.includes(selectedChapter.index)
  ) {
    return (
      <div className={styles.instructions}>
        {selectedChapter &&
        !bookDetails.userOwnership.chaptersPurchased.includes(
          selectedChapter.index
        )
          ? "Please purchase this chapter to read it."
          : "Select a chapter from the sidebar to start reading."}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.pdfContainer}>
      <Document
        file={selectedChapter.url}
        onLoadSuccess={handleDocumentLoadSuccess}
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
          {isSideBySide && pageNumber + 1 <= (numPages || 0) && (
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
    </div>
  );
};

export default PDFContent;
