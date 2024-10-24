"use client";

import React from "react";
import AuthorBoard from "../components/author-board/AuthorBoard";

const AuthorBoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6 p-6">Author Dashboard</h1>
      <AuthorBoard />
    </div>
  );
};

export default AuthorBoardPage;
