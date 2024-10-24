import SearchBar from "./SearchBar";
import UserLibrary from "./UserLibrary";
import BookstoreShelf from "./BookstoreShelf";
import { BookProvider } from "./BookContext";

export default function MainContent() {
  return (
    <BookProvider>
      <div className="flex h-screen bg-gray-100 p-6">
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 pb-4">
            <SearchBar />
          </div>
          <div className="p-6 space-y-6">
            <UserLibrary />
            <BookstoreShelf />
          </div>
        </main>
      </div>
    </BookProvider>
  );
}
