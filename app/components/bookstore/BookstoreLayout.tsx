import SearchBar from "./SearchBar";
import MyBookLibrary from "./MyBookLibrary";
import StoreBook from "./StoreBook";

export default function MainContent() {
  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 pb-4">
          <SearchBar />
        </div>
        <div className="p-6 space-y-6">
          <MyBookLibrary />
          <StoreBook />
        </div>
      </main>
    </div>
  );
}
