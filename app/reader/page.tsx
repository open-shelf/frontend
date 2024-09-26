"use client";

import { useSearchParams } from "next/navigation";
import PDFViewer from "../components/bookstore/pdf-viewer";
import { useBook } from "../components/bookstore/BookContext";

const ReaderPage = () => {
  const searchParams = useSearchParams();
  const { bookDetails } = useBook();

  console.log("We are here!");
  console.log(bookDetails);

  if (!bookDetails) {
    return (
      <div>
        Loading book details... If this persists, please go back and select a
        book.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow">
        <PDFViewer />
      </main>
    </div>
  );
};

export default ReaderPage;
