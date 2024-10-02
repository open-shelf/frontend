"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import WalletConnectButton from "../WalletConnectButton";
import Link from "next/link";

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-[#A8DADC] p-6 rounded-2xl shadow-md">
      <Link
        href="/bookstore"
        className="text-3xl font-bold text-[#1D3557] relative group cursor-pointer"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1D3557] to-[#E63946] transition-all duration-300 ease-in-out group-hover:tracking-wider">
          OpenShelf
        </span>
        <span className="text-[#457B9D] transition-all duration-300 ease-in-out group-hover:text-[#E63946]">
          {" "}
          Books
        </span>
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#E63946] transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
      </Link>
      <div className="flex items-center space-x-4">
        <div className="relative">
          {isSearchOpen ? (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search books..."
                className="w-64 p-2 pl-8 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          )}
        </div>
        <WalletConnectButton />
      </div>
    </div>
  );
}
