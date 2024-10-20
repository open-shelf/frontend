"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBooks } from "../components/bookstore/BookContext";
import PDFViewer from "../components/bookstore/pdf-viewer";

const ReaderPage = () => {
  const searchParams = useSearchParams();
  const { books } = useBooks();
  const [bookPubKey, setBookPubKey] = useState<string | null>(null);

  useEffect(() => {
    const bookPubKey = searchParams.get("bookPubKey");
    if (bookPubKey) {
      setBookPubKey(bookPubKey);
    }
  }, [searchParams]);

  if (!bookPubKey) {
    return <div>No book selected</div>;
  }

  return <PDFViewer bookPubKey={bookPubKey} />;
};

export default ReaderPage;
