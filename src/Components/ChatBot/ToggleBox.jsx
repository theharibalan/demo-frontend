import React, { useState, useCallback, useEffect } from "react";
import logo from "../../assets/images/Logo.jpeg";
import chatbot from "../../assets/images/Chatbot.jpeg";
import { FaArrowDown, FaRedo, FaTimes } from "react-icons/fa";
import "./tailwind.css"; // Ensure this imports the CSS for typing animation
import ChatInterface from "./ChatInterface";

const ToggleBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(Date.now()); // Unique key for re-rendering
  const [showToast, setShowToast] = useState(false);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  const closeBox = () => {
    setIsOpen(false);
  };

  const reloadChatInterface = useCallback(() => {
    setChatKey(Date.now()); // Change the key to force re-render
    setShowToast(true); // Show toast message
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  }, []);

  useEffect(() => {
    setShowToast(true); // Show toast when component mounts
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  }, []);

  return (
    <div className="fixed bottom-3 right-5 flex flex-col items-end text-xl" style={{ zIndex: 9999 }}>
      {/* Toast Message */}
      {showToast && (
        <div className="relative">
          <div className="absolute bottom-1 right-0 mb-4 p-3 bg-white text-black rounded-lg shadow-lg flex items-center whitespace-nowrap text-lg">
            <span>Hi! Welcome to the world of B2B Hub India!.... What can I help you with?</span>
            <div className="absolute top-full right-4 w-0 h-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-white"></div>
          </div>
        </div>
      )}

      {/* Toggle Box */}
      <div
        className={`fixed bottom-0 right-0 w-full h-full md:w-[34vw] md:h-[95vh] overflow-y-auto bg-gray-100 rounded-lg shadow-lg transition-all duration-300 ease-in-out flex flex-col ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-full invisible"} text-lg`}
      >
        {/* Title Bar */}
        <div className="bg-gradient-to-b from-red-400 via-red-500 to-red-600 text-white p-4 rounded-t-lg flex items-center sticky top-0 z-10 text-2xl">
          <img src={logo} alt="Logo" className="w-16 h-16 mr-3 rounded-full" />
          <h2 className="flex-grow">B2BHub India</h2>
          <button
            onClick={reloadChatInterface}
            className="text-white bg-red-700 hover:bg-red-800 p-3 rounded-full ml-3 text-xl"
          >
            <FaRedo className="w-6 h-6" />
          </button>
          <button
            onClick={closeBox}
            className="text-white bg-red-700 hover:bg-red-800 p-3 rounded-full ml-3 text-xl"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Chatbox Content */}
        <div className="p-6 bg-white flex-grow rounded-b-lg text-lg">
          <ChatInterface id="chatArea" key={chatKey} /> {/* Pass the key to force re-render */}
        </div>
      </div>

      {/* Toggle Icon */}
      <div
        onClick={toggleBox}
        className="text-2xl"
      >
        {isOpen ? 
          <FaArrowDown className="w-16 h-16 p-4 bg-gradient-to-b from-red-400 via-red-500 to-red-600 text-white flex items-center justify-center rounded-full cursor-pointer mb-4 transition-transform duration-300 hover:scale-110" />
          : 
          <img src={chatbot} alt="Logo" className="w-24 h-24 bg-red-500 text-white flex items-center justify-center rounded-full text-3xl cursor-pointer mb-4 transition-transform duration-300 hover:scale-110" />
        } {/* Conditional rendering of icons */}
      </div>
    </div>
  );
};

export default ToggleBox;
