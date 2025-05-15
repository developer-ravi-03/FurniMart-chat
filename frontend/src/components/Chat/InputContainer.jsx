import React, { useState } from "react";
import { Send, Paperclip, Smile, Mic, Image } from "lucide-react";

const InputContainer = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      await onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="px-2 sm:px-4 py-3 bg-white border-t border-gray-200">
      <form onSubmit={handleSend} className="flex items-center">
        {/* Attachment buttons */}
        <div className="flex items-center mr-2 space-x-1">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none transition-colors hidden sm:block"
            disabled={disabled}
          >
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none transition-colors hidden sm:block"
          >
            <Image size={18} />
          </button>
        </div>

        {/* Message input */}
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Select a chat to start messaging..."
                : "Type your message..."
            }
            disabled={disabled}
          />

          {/* Emoji button (positioned inside input) */}
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none transition-colors"
            disabled={disabled}
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Send/mic button */}
        <div className="ml-2 flex">
          {input.trim() ? (
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full focus:outline-none transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
              aria-label="Send message"
            >
              <Send size={18} className="fill-current" />
            </button>
          ) : (
            <button
              type="button"
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
              aria-label="Voice message"
            >
              <Mic size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Optional formatting toolbar - can be toggled with a button */}
      <div className="hidden">
        <div className="flex items-center justify-between py-2 px-3 border-t mt-2">
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">B</button>
            <button className="p-1 hover:bg-gray-100 rounded">I</button>
            <button className="p-1 hover:bg-gray-100 rounded">U</button>
            <button className="p-1 hover:bg-gray-100 rounded">S</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputContainer;
