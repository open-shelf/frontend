import React, { useState } from "react";
import styles from "./pdf-viewer.module.css";

interface ControlBarProps {
  selectedChapter: any;
  onChapterSelect: (chapter: any) => void;
  bookDetails: any;
  numPages: number | null;
  pageNumber: number;
  onPageChange: (newPageNumber: number) => void;
  scale: number;
  onScaleChange: (newScale: number) => void;
  isSideBySide: boolean;
  onToggleSideBySide: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  selectedChapter,
  onChapterSelect,
  bookDetails,
  numPages,
  pageNumber,
  onPageChange,
  scale,
  onScaleChange,
  isSideBySide,
  onToggleSideBySide,
}) => {
  const [isControlBarMinimized, setIsControlBarMinimized] = useState(false);

  const purchasedChapters = bookDetails.chapters.filter((chapter: any) =>
    bookDetails.userOwnership.chaptersPurchased.includes(chapter.index)
  );

  const currentChapterIndex = purchasedChapters.findIndex(
    (chapter: any) => chapter.index === selectedChapter.index
  );

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + (isSideBySide ? offset * 2 : offset);
    onPageChange(Math.max(1, Math.min(newPageNumber, numPages || 1)));
  };

  const changeChapter = (offset: number) => {
    const newIndex = currentChapterIndex + offset;
    if (newIndex >= 0 && newIndex < purchasedChapters.length) {
      onChapterSelect(purchasedChapters[newIndex]);
      onPageChange(1); // Reset to first page of new chapter
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    onScaleChange(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5);
    onScaleChange(newScale);
  };

  const toggleSideBySide = () => {
    onToggleSideBySide();
    // Adjust page number when toggling to side-by-side view
    if (!isSideBySide && pageNumber % 2 === 0) {
      onPageChange(pageNumber - 1);
    }
  };

  return (
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
        <button
          onClick={() => changeChapter(-1)}
          disabled={currentChapterIndex <= 0}
          className={styles.button}
        >
          Previous Chapter
        </button>
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className={styles.button}
        >
          ←
        </button>
        <span className={styles.pageInfo}>
          {pageNumber} / {numPages} (Chapter {selectedChapter.index + 1} of{" "}
          {purchasedChapters.length})
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= (numPages || 1)}
          className={styles.button}
        >
          →
        </button>
        <button
          onClick={() => changeChapter(1)}
          disabled={currentChapterIndex >= purchasedChapters.length - 1}
          className={styles.button}
        >
          Next Chapter
        </button>
        <button onClick={zoomOut} className={styles.button}>
          -
        </button>
        <button onClick={zoomIn} className={styles.button}>
          +
        </button>
        <button onClick={toggleSideBySide} className={styles.button}>
          {isSideBySide ? "One Page View" : "Two Page View"}
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
