"use client";

import React from "react";
import WritingBoard from "../components/author-board/WritingBoard";
import Link from "next/link";

const WritingBoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <Link href="/author-board">
        <button className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300">
          Back to Author Dashboard
        </button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Write New Book</h1>
      <WritingBoard onClose={() => {}} />
    </div>
  );
};

export default WritingBoardPage;
