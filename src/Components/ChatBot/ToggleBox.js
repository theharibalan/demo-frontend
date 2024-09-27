import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/Logo.jpeg";
import chatbot from "../../assets/images/Chatbot.jpeg";
import { FaArrowDown, FaRedo, FaTimes } from "react-icons/fa";
import "./ChatBot.css";
import ChatInterface from "./ChatInterface";
import 'tailwindcss/tailwind.css';
// /** @type {import('tailwindcss').Config} */



const ToggleBox = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(Date.now());
  const [showToast, setShowToast] = useState(false);

  const toggleBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const reloadChatInterface = useCallback(() => {
    setChatKey(Date.now());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [isOpen]);

  return (

    
    <div className="fixed bottom-24 right-5 flex flex-col items-end z-9999 sm:w-full">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-14 mr-5 sm:mb-2 z-10000"
            >
            <div className="bg-white text-black rounded-lg shadow-lg p-3 flex items-center whitespace-nowrap pl-5 pr-5 mb-16">
              <span>Hi! Welcome to B2B Hub India! How can we assist you?</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

     <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="z-10001 absolute bottom-4 right-4 w-[90vw] h-[80vh] max-w-[400px] max-h-[600px] bg-gray-100 rounded-lg shadow-lg flex flex-col overflow-hidden lg:w-[34vw] lg:h-[80vh] lg:max-w-[none] lg:max-h-[none]"
    >
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-t-lg flex items-center">
        <img src={logo} alt="Logo" className="w-10 h-10 mr-2 rounded-full lg:w-12 lg:h-12" />
        <h2 className="text-lg font-bold flex-grow truncate lg:text-xl">B2BHub India</h2>
        <button
          onClick={reloadChatInterface}
          className="text-white bg-red-700 hover:bg-red-800 p-2 rounded-full ml-2 transition-colors duration-300"
        >
          <FaRedo />
        </button>
        <button
          onClick={toggleBox}
          className="text-white bg-red-700 hover:bg-red-800 p-2 rounded-full ml-2 transition-colors duration-300"
        >
          <FaTimes />
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <ChatInterface key={chatKey} />
      </div>
    </motion.div>
  )}
</AnimatePresence>

<motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={toggleBox}
  className="cursor-pointer fixed bottom-4 right-4 lg:bottom-16 lg:right-16"
>
  {isOpen ? (
    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center rounded-full shadow-lg lg:w-16 lg:h-16">
      <FaArrowDown className="text-xl lg:text-2xl" />
    </div>
  ) : (
    <img
      src={chatbot}
      alt="Chatbot"
      className="w-16 h-16 bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg lg:w-20 lg:h-20"
    />
  )}
</motion.div>

    </div>
  );
};

export default ToggleBox;