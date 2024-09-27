import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaTicketAlt, FaUser, FaLock } from 'react-icons/fa';
import logo from "../../assets/images/Logo.jpeg";
import axios from "axios";
import './ChatBot.css';
import { Description } from '@mui/icons-material';

const messages = [
    { id: 7, text: "Contact support", answer: "You can contact our support team via the contact us page. We provide support via email and phone." },
    { id: 6, text: "Status of the ticket" },
    { id: 5, text: "Raise a Complaint" },
    { id: 4, text: "Login", answer: "https://www.b2bhubindia.com/login" },
    { id: 3, text: "Register", answer: "https://www.b2bhubindia.com/reg" },
    { id: 2, text: "What are the business hours?", answer: "Our business hours are Monday to Friday, 9 AM to 6 PM." },
    { id: 1, text: "Hello", answer: "I'm here to help! How can I assist you?" },
].sort((a, b) => a.id - b.id);

const complaintOptions = [
    { type: "Product Related", message: "Product Related Complaint" },
    { type: "Payment Related", message: "Payment Related Complaint" },
    { type: "Shipping Related", message: "Shipping Related Complaint" },
    { type: "Service Related", message: "Service Related Complaint" },
    { type: "Others"}
];




const ChatInterface = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [showComplaintOptions, setShowComplaintOptions] = useState(false);
    const [showOtherComplaintInput, setShowOtherComplaintInput] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [otherComplaint, setOtherComplaint] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);
    

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSend = async () => {
        if (inputValue.trim() === '') return;

        setShowComplaintOptions(false);
        setShowLogin(false);
        setShowTicket(false);
        setShowOtherComplaintInput(false);

        const userMessage = { type: 'user', content: inputValue };
        setChatHistory(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const botResponse = processUserInput(inputValue);
            setChatHistory(prev => [...prev, { type: 'bot', content: botResponse }]);
            setLoading(false);
        }, 1000);
    };

    const processUserInput = (input) => {
        const lowercaseInput = input.toLowerCase();

        if (lowercaseInput.includes('login')) {
            const htmlString = `Click the link to Login : <a href="https://www.b2bhubindia.com/login" target="_blank" rel="noopener noreferrer"><b>https://www.b2bhubindia.com/login</b></a>`;
            return (
                <div dangerouslySetInnerHTML={{ __html: htmlString }} />
            );
        } else if (lowercaseInput.includes('register')) {
            const htmlString = `Click the link to Register : <a href="https://www.b2bhubindia.com/reg" target="_blank" rel="noopener noreferrer"><b>https://www.b2bhubindia.com/reg</b></a>`;
            return (
                <div dangerouslySetInnerHTML={{ __html: htmlString }} />
            );
        } 
        else if (lowercaseInput.includes('complaint')) {
            if (isLoggedIn) {
                setShowComplaintOptions(true);
                return "Please select a complaint category:";
            } else {
                setShowLogin(true);
                return "To raise a complaint, please login first. I've opened the login form for you.";
            }
        } else if (lowercaseInput.includes('ticket') || lowercaseInput.includes('status')) {
            setShowTicket(true);
            return "Please enter your ticket ID to check its status.";
        } else {
            const matchedMessage = messages.find(msg =>
                lowercaseInput.includes(msg.text.toLowerCase()) && msg.answer
            );
            return matchedMessage ? matchedMessage.answer : "I'm sorry, I didn't understand that. Can you please rephrase or choose from the available options?";
        }
    };

  

    // const authenticateUser = async (email, password) => {
    //     try {
    //         // Simulate network delay
    //         await new Promise(resolve => setTimeout(resolve, 1000));

    //         // Check for dummy user credentials
    //         const user = dummyUsers.find(user => user.email === email && user.password === password);
    //         if (user) {
    //             return {
    //                 token: "dummy-token-123",
    //                 user: {
    //                     customerId: user.customerId,
    //                     CompanyName: user.CompanyName
    //                 }
    //             };
    //         } else {
    //             throw new Error("Invalid email or password");
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error("Authentication failed");
    //     }
    // };

    //   const dummyUsers = [
    //     { email: "testuser@example.com", password: "password123", customerId: "user-001", CompanyName: "Test Company" }
    // ];

    const authenticateUser = async (email, password) => {
        const response = await fetch('https://erp-backend-new-vxx6.onrender.com/b2b/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password,
                isSeller: false // Ensure this is sent in the body
            })
        });
    
        if (!response.ok) {
            throw new Error('Failed to authenticate');
        }
    
        const data = await response.json();
        return data;
    };

    const handleAuthSubmit = async () => {
        setLoading(true);
        try {
            const data = await authenticateUser(email, password); // Call the updated authenticateUser function
            localStorage.setItem("token", data.token);
            localStorage.setItem("customerId", data.user.customerId);
            localStorage.setItem("companyname", data.user.CompanyName);
            localStorage.setItem("phone", data.user.phoneNo);
            localStorage.setItem("userEmail", data.user.Email);

            
            setChatHistory(prev => [
                ...prev, 
                { type: 'bot', content: `Welcome, ${data.user.CompanyName}! You're now logged in. Click Raise a Complaint again.` }
            ]);
    
            setShowLogin(false);
            setIsLoggedIn(true);
            setShowOtherComplaintInput(false);
            setShowComplaintOptions(false);
        } catch (err) {
            setAuthError("Authentication failed. Please check your credentials and try again.");
            setTimeout(() => {
                setAuthError("");
            }, 3000);
            setEmail("");
            setPassword("");
        }
        setLoading(false);
        setShowTicket(false);
    };
    
    

    // const handleAuthSubmit = async () => {
    //     setLoading(true);
    //     try {
    //         const data = await authenticateUser(email, password);
    //         localStorage.setItem("token", data.token);
    //         localStorage.setItem("customerId", data.user.customerId);
    //         localStorage.setItem("companyname", data.user.CompanyName);
    //         setChatHistory(prev => [...prev, { type: 'bot', content: `Welcome, ${data.user.CompanyName}! You're now logged in. Click Raise a Complaint again.` }]);
    //         setShowLogin(false);
    //         setIsLoggedIn(true);
    //         setShowOtherComplaintInput(false);
    //         setShowComplaintOptions(false);

    //     } catch (err) {
    //         setAuthError("Authentication failed. Please check your credentials and try again.");
    //         setTimeout(() => {
    //             setAuthError("");
    //         }, 3000);
    //         setEmail("");
    //         setPassword("");
    //     }
    //     setLoading(false);
    //     setShowTicket(false);

    // };


    const handleComplaintOptionClick = (option) => {
        if (option.type === "Others") {
            setShowOtherComplaintInput(true);
        } else {
            raiseComplaint(option);
        }
    };

    const handleOtherComplaintSubmit = () => {
        if (otherComplaint.trim()) {
            const complaint = {
                type: "Others",
                message: otherComplaint,
            };
            raiseComplaint(complaint);
            setOtherComplaint('');
            setShowComplaintOptions("false");
            setShowOtherComplaintInput("false")
        } else {
            alert("Please describe your complaint.");
        }
    };

    // const handleComplaintOptionClick = (option) => {
    //     if (option === "Others") {
    //         setShowOtherComplaintInput(true);
    //     } else {
    //         raiseComplaint(option);
    //     }
    //     setShowComplaintOptions(false);
    // };

    // const handleOtherComplaintSubmit = () => {
    //     if (otherComplaint.trim() !== '') {
    //         raiseComplaint(otherComplaint);
    //         setShowOtherComplaintInput(false);
    //         setOtherComplaint('');
    //     }
    // };


    const raiseComplaint = async (complaintType) => {
        const customerId = localStorage.getItem('customerId');
        const phnNumber = localStorage.getItem('phone');
    
        try {
            // Make an API call to submit the ticket
            const response = await fetch('https://support-backend-qwmm.onrender.com/ticket/addTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: "Empty", // Set to "Empty" as required
                    customerId: customerId,
                    Subject: complaintType.type, // Use type for subject
                    Description: complaintType.message, // Use message for description
                    PhnNumber: phnNumber,
                    TicketCategory: complaintType.message, // Default to 'General' if no category provided
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit the complaint');
            }
    
            const data = await response.json();
            const ticketId = data.TID; // Match the response structure from your backend
    
            // Update the chat history
            setChatHistory((prev) => [
                ...prev,
                { type: 'user', content: `Complaint: ${complaintType.type}` },
                { type: 'bot', content: `Thank you for raising a complaint about "${complaintType.message}". You're Ticket ID: ${ticketId}` }
            ]);
            setShowComplaintOptions(false);
            setShowOtherComplaintInput(false);
            
        } catch (error) {
            // Handle error, possibly notify the user about the failure
            console.error('Error:', error);
            setChatHistory((prev) => [
                ...prev,
                { type: 'bot', content: 'Sorry, there was an issue submitting your complaint. Please try again later.' }
            ]);
            setShowComplaintOptions(false);
            setShowOtherComplaintInput(false);
        }
    };
    
    
    



    // const raiseComplaint = (complaintType) => {
    //     // Here you would typically make an API call to submit the complaint
    //     // For now, we'll just add it to the chat history
    //     setChatHistory(prev => [
    //         ...prev,
    //         { type: 'user', content: `Complaint: ${complaintType}` },
    //         { type: 'bot', content: `Thank you for raising a complaint about "${complaintType}". Our team will look into it and get back to you soon. Your complaint ID is ${Math.floor(Math.random() * 10000)}.` }
    //     ]);
    // };

    // const handleTicketStatusSubmit = async () => {
    //     setLoading(true);
    //     try {
    //         // Simulate API call
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         const dummyStatus = ["In Progress", "Resolved", "Pending"][Math.floor(Math.random() * 3)];
    //         setChatHistory(prev => [...prev, { type: 'bot', content: `The status of ticket ${ticketId} is: ${dummyStatus}` }]);
    //         setShowTicket(false);
    //         setTicketId("");
    //     } catch (error) {
    //         setChatHistory(prev => [...prev, { type: 'bot', content: 'An error occurred while fetching the ticket status. Please try again later.' }]);
    //     }
    //     setLoading(false);
    //     setShowLogin(false);
    //     setShowTicket(false);

    // };

    // Function to handle ticket status submission
    const handleTicketStatusSubmit = async () => {
        setLoading(true);
        try {
            // Perform API call using Axios
            const response = await axios.get(`https://support-backend-qwmm.onrender.com/ticket/getTicketStatus/${ticketId}`);
            let status = response.data.status; // Adjust based on your API response structure
            if (status === "0") {
                status = "OPEN";
            } else if (status === "1") {
                status = "PENDING";
            } else if (status === "2") {
                status = "CLOSED";
            }
    
            // Determine the response message
            let responseMessage = `The status of ticket ${ticketId} is: ${status}`;
    
            if (status === "OPEN" || status === "PENDING") {
                responseMessage += ". It will be resolved within 3-4 business days.";
            }
    
            // Update chat history with the ticket status
            setChatHistory(prev => [...prev, { type: 'bot', content: responseMessage }]);
            setShowTicket(false);
            setTicketId("");
        } catch (error) {
            // Check if the error response is from the API
            if (error.response) {
                if (error.response.status === 404) {
                    // Ticket not found
                    setChatHistory(prev => [...prev, { type: 'bot', content: 'Please check your ticket ID. The ticket may not be available.' }]);
                } else {
                    // Other errors
                    setChatHistory(prev => [...prev, { type: 'bot', content: 'An error occurred while fetching the ticket status. Please try again later.' }]);
                }
            } else {
                // Network or other errors
                setChatHistory(prev => [...prev, { type: 'bot', content: 'An error occurred while fetching the ticket status. Please check your network connection.' }]);
            }
            setTicketId("");
        }
        setLoading(false);
        setShowLogin(false);
        setShowTicket(false);
    };
    



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full bg-gray-100 rounded-lg shadow-lg"
        >
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                   {chatHistory.map((message, index) => (
    <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
        <div className={`max-w-3/4 p-3 rounded-lg flex items-center space-x-3 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
            {message.type === 'bot' && (
                <img src={logo} alt="Bot" className="w-8 h-8 rounded-full" />
            )}
            <p className="flex-1 pt-3">
                {/* {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)} */}
                {message.content}
            </p>
        </div>
    </motion.div>
))}

                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {showLogin && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-white rounded-lg shadow-md m-4"
                >
                    <h3 className="text-lg font-semibold mb-4">Login</h3>
                    <div className="space-y-4">
                        <div className="flex items-center border rounded-md">
                            <FaUser className="text-gray-400 ml-2 mr-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center border rounded-md">
                            <FaLock className="text-gray-400 ml-2 mr-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 rounded-md focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleAuthSubmit}
                            className="pl-10 pr-10 w-auto bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Login"}
                        </button>
                        {authError && <p className="text-red-500 text-sm">{authError}</p>}
                    </div>
                </motion.div>
            )}

            {showTicket && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-white rounded-lg shadow-md m-4"
                >
                    {/* <h3 className="text-lg font-semibold mb-4">Check Ticket Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center border rounded-md">
                            <FaTicketAlt className="text-gray-400 ml-2 mr-2" />
                            <input
                                type="text"
                                placeholder="Enter Ticket ID"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="w-full p-2 rounded-md focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleTicketStatusSubmit}
                            className="w-auto pl-10 pr-10 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Check Status"}
                        </button>
                    </div> */}

                    <h3 className="text-lg font-semibold mb-4">Check Ticket Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center border rounded-md">
                            <FaTicketAlt className="text-gray-400 ml-2 mr-2" />
                            <input
                                type="text"
                                placeholder="Enter Ticket ID"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="w-full p-2 rounded-md focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleTicketStatusSubmit}
                            className="w-auto pl-10 pr-10 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Check Status"}
                        </button>
                    </div>
                </motion.div>
            )}
  {showComplaintOptions && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-white rounded-lg shadow-md m-4"
                >
                    <h3 className="text-lg font-semibold mb-4">Select Complaint Category</h3>
                    <div className="space-y-2">
                        {complaintOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleComplaintOptionClick(option)}
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                {option.type}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {showOtherComplaintInput && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-white rounded-lg shadow-md m-4"
                >
                    <h3 className="text-lg font-semibold mb-4">Describe Your Complaint</h3>
                    <div className="space-y-4">
                        <textarea
                            value={otherComplaint}
                            onChange={(e) => setOtherComplaint(e.target.value)}
                            placeholder="Please describe your complaint here..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                        <button
                            onClick={handleOtherComplaintSubmit}
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Submit Complaint
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="p-4 bg-white border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap justify-center">
                    {messages.map((msg) => (
                        <button
                            key={msg.id}
                            onClick={() => setInputValue(msg.text)}
                            className="m-1 px-3 py-1 bg-gray-200 rounded-full text-lg hover:bg-gray-300 transition duration-300 text-left"
                        >
                            {msg.text}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatInterface;