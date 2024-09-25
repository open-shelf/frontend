import { useRouter } from "next/router";
import PDFViewer from "../../components/bookstore/pdf-viewer";

const ReaderPage = () => {
  const router = useRouter();
  const { url, title } = router.query;

  if (!url || typeof url !== "string") {
    return <div>No PDF URL provided</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <h1 className="text-2xl">{title || "PDF Reader"}</h1>
        <button
          onClick={() => router.back()}
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
