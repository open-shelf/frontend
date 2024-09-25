import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-orange-500">OpenShelf Books</h1>
      <div className="flex-1 mx-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search books here..."
            className="w-full p-3 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
          <span>Lang</span>
          <ChevronDown size={16} />
        </button>
        <button className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
          <Image
            src="/placeholder.svg"
            alt="User"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span>Kenson</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
