"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function AIAgentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#DDF95C] hover:bg-[#cbe94d] text-black shadow-lg transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Temporary popup message */}
      {open && (
        <div className="fixed bottom-24 right-6 bg-white border shadow-lg rounded-lg p-4 w-72">
          <p className="text-gray-700 text-sm">
            👋 Hi! The AI assistant feature is coming soon.
          </p>
        </div>
      )}
    </>
  );
}
