"use client";

import { useSearchParams } from "next/navigation";
import PDFViewer from "../components/bookstore/pdf-viewer";

const ReaderPage = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title");

  if (!url) {
    return <div>No PDF URL provided</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <h1 className="text-2xl">{title || "PDF Reader"}</h1>
        <button
          onClick={() => window.history.back()}
          className="mt-2 text-sm underline"
        >
          Back to Bookstore
        </button>
      </header>
      <main className="flex-grow">
        <PDFViewer pdfUrl={decodeURIComponent(url)} />
      </main>
    </div>
  );
};

export default ReaderPage;
