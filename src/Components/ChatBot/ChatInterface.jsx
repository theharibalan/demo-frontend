import React, { useState, useEffect, useRef } from 'react';
import logo from "../../assets/images/Logo.jpeg";
import "./tailwind.css";  // Ensure this imports the CSS for typing animation
import axios from "axios";

const messages = [
    { id: 8, text: "Contact support", answer: "You can contact our support team via the contact us page. We provide support via email and phone." },
    { id: 7, text: "Status of the ticket" },
    { id: 6, text: "Raise a Complaint" },
    { id: 5, text: "Login", answer: "https://www.b2bhubindia.com/login" },
    { id: 4, text: "Register", answer: "https://www.b2bhubindia.com/reg" },
    { id: 3, text: "How can I track my order?", answer: "You can track your order by logging into your account and checking the order status section." },
    { id: 2, text: "What are the business hours?", answer: "Our business hours are Monday to Friday, 9 AM to 6 PM." },
    { id: 1, text: "Hello", answer: "I'm here to help! How can I assist you?" },
].sort((a, b) => a.id - b.id);


const chatArea = document.getElementById('chatSection')
const ChatInterface = () => {
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [status, setStatus] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherComplaint, setOtherComplaint] = useState('');
    const [ticketId, setTicketId] = useState(''); 
    const [ticketStatus, setTicketStatus] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    


    useEffect(() => {
        if (activeQuestionId) {
            // Start loading when a new question is active
            setLoading(true);

            // Set a timer for 3 seconds before showing the answer
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);

            // Clear the timer when the component unmounts or activeQuestionId changes
            return () => clearTimeout(timer);
        }
    }, [activeQuestionId]);

    const activeMessage = messages.find((msg) => msg.id === activeQuestionId);

    const setTicketValues = (e) => {
        setTicketId(e.target.value);
        setTicketStatus('');  // Reset ticket status when typing
    };
    

    const handleInputChange = (e) => {
        const value = e.target.value;
        setActiveQuestionId(null);
        setStatus(null);
        setShowCategories(false);
        setShowOtherInput(false);
        setInputValue(value);
        if (activeQuestionId === value) {
            setActiveQuestionId(null);
            setStatus(null);
            setShowCategories(false);
            setShowOtherInput(false);
        }

        const messageId = parseInt(value, 10);
        if (!isNaN(messageId)) {
            if (activeQuestionId) {
                setActiveQuestionId(null);
                setStatus(null);
                setShowCategories(false);
                setShowOtherInput(false);
            }
            else{
                setActiveQuestionId(messageId);
            }
        }
    };
    const scrollFuntion = ()=>{
        chatArea.scrollTop = chatArea.scrollHeight
    }

    const handleQuestionClick = (id) => {
        if (activeQuestionId === id) {
            setActiveQuestionId(null);
            setStatus(null);
            setShowCategories(false);
            setShowOtherInput(false);
            scrollFuntion()
        }
        else {
            
                setInputValue('');
            const message = messages.find((msg) => msg.id === id);

            if (message.text === "Raise a Complaint") {
                setStatus("");
                setActiveQuestionId(id);
                setShowLogin(true); // Show login form
            }
            else if (message.text === "Status of the ticket") {
                setStatus("check-status");
                setActiveQuestionId(id);
            } else if (message.link) {
                window.location.href = message.link;
            } else {
                setStatus("typing");
                setActiveQuestionId(id);
                setTimeout(() => {
                    setStatus(null);
                }, 1000);
            }
        }
    
    };

    const handleAuthSubmit = async () => {
    axios
    .post("https://erp-backend-new-1.onrender.com/b2b/login", 
        { email: email, pwd: password, isSeller: false },
        )
  .then((res) => {
            if (res.status === 200) {
              console.log("data irukuda",res.data.user)
              const customer = res.data.user;
              localStorage.setItem("token", res.data.token); 
              localStorage.setItem("loggedas","Buyer Page");
              localStorage.setItem("loginstate", "true");
              localStorage.setItem("userEmail", email);
              localStorage.setItem("customerId", customer.customerId);
              localStorage.setItem("companyname", customer.CompanyName);
              localStorage.setItem("email", customer.Email);
              localStorage.setItem("phone", customer.phoneNo);


            const company = localStorage.getItem("companyname")
            setCompanyName(company);
                        if (res.status === 200) {  
                setStatus(null);
                setShowCategories(true);
                setShowLogin(false); // Hide login form after successful authentication
            } 
            }
          })
          .catch((err) => {
         console.error('Error:', err);
            setAuthError("An error occurred while trying to authenticate.");          });
        };

    // const handleAuthSubmit = async () => {
    //     try {
    //         const response = await fetch('https://erp-backend-new-1.onrender.com/b2b/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, pwd: password, isSeller: "false" }), // Pass isSeller to the backend
    //         });
    
    //         const data = await response.json();
    
    //         if (response.ok) {  
    //             setStatus(null);
    //             setShowCategories(true);
    //             setCompanyName(data.customer.CompanyName); // Save company_name to state
    //             setShowLogin(false); // Hide login form after successful authentication
    //         } else {
    //             setAuthError(data.message || "Authentication failed"); // Use backend error message
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setAuthError("An error occurred while trying to authenticate.");
    //     }
    // };
    
    const handleCategoryClick = async (category) => {
        const complaintMessages = {
            "Product related complaint": "Product is defective.",
            "Shipping related complaint": "Shipping was delayed.",
            "Payment related complaint": "Payment failed.",
            "Service related complaint": "Service was not satisfactory.",
            "Other": "Other complaint."
        };
    
        const categoryVal = category;
    
        if (category === "Other") {
            setShowOtherInput(true);
            setActiveQuestionId(null);
        } else {
            const complaintText = complaintMessages[category];
    
            if (complaintText) {
                const customerId = localStorage.getItem("customerId");
                const number = localStorage.getItem("phone");
    
                if (!customerId || !number) {
                    setStatus('Missing required fields: Customer ID or phone number.');
                    return;
                }

                
    
                try {
                    // Send a request to submit the complaint
                    const response = await fetch('http://localhost:5000/tickets/addTicket', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productId: null,
                            customerId: customerId,
                            AssignedStatus: null,
                            Status: "Open",
                            CreatedDate: new Date().toISOString(), // ISO format
                            ResolvedDate: null,
                            Priority: null,
                            Subject: null,
                            Description: complaintText,
                            PhnNumber: number,
                            TicketCategory: categoryVal,
                        }),
                    });
                    
                    const data = await response.json();
    
                    if (response.ok) {
                        // Show a message with the ticket ID
                        setStatus(`Dear Customer, ${customerId}. Your ticket ID is ${data.user.TID}. We will get back to you soon in 2 to 3 days.`);
                    } else {
                        setStatus('Failed to submit the complaint.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setStatus('An error occurred while submitting the complaint.');
                }
            }
        }
    };
    

    const handleOtherComplaintSubmit = async () => {
        const customerId = localStorage.getItem("customerId");
        const number = localStorage.getItem("phone");
        try {
            // Send a request to submit the other complaint
            const response = await fetch('http://localhost:5000/tickets/addTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: null,
                    customerId: customerId,
                    AssignedStatus: null,
                    Status: "Open",
                    CreatedDate: new Date().toISOString(), // ISO format
                    ResolvedDate: null,
                    Priority: null,
                    Subject: null,
                    Description: otherComplaint,
                    PhnNumber: number,
                    TicketCategory: "Other",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Show a message with the ticket ID
                setStatus(`Dear Customer, ${customerId}. Your ticket ID is ${data.user.TID}. We will get back to you soon in 2 to 3 days.`);
                setOtherComplaint(''); // Clear the input field
                setShowOtherInput(false); // Hide the input field
            } else {
                setStatus('Failed to submit the complaint.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('An error occurred while submitting the complaint.');
        }
    };

    const handleTicketStatusSubmit = async () => {
        const TicketId = ticketId;
        try {
            const response = await fetch(`http://localhost:5000/tickets/getTicketStatus/${TicketId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTicketStatus(data.status); // Directly use the status from the response
        } catch (error) {
            console.error('Error:', error);
            setTicketStatus('An error occurred while fetching the ticket status.');
        }
    };

return (

        <div id='chatSection' className="flex flex-col p-2 space-y-2 overflow-y-auto">
            <div className="flex items-center mt-2 py-4">
                <img src={logo} alt="Logo" className="w-12 h-12 mr-2 rounded-full" />
                <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                    <p>Hi! Welcome to the world of B2B Hub India!.... What can I help you with?</p>
                </div>
            </div>

            <div className="flex flex-col-reverse w-full">
                <div className="flex justify-end w-full">
                    <div  className="w-60 bg-gradient-to-b from-red-500 via-red-500 to-red-600 rounded-lg px-2 py-3 border-red-700">
                        {messages.map((message) => (
                            <div key={message.id} className="flex mb-2 justify-end w-full">
                                <div
                                    onClick={() => handleQuestionClick(message.id)}
                                    className={`rounded-lg cursor-pointer text-left w-60 "bg-red-500 text-white p-2 hover:bg-red-400 hover:text-black transition-colors duration-300" ${message.id === activeQuestionId}`}
                                >
                                    <p>{message.id + ". " + message.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Display the answer if there is one */}
            {activeQuestionId && activeMessage && (
                <div className="flex items-center mt-2 py-4">
                    <img src={logo} alt="Logo" className="w-12 h-12 mr-2 rounded-full" />
                    <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                        {loading ? (
                            <p>Typing...</p> // Show loading message
                        ) : (
                            <p>{activeMessage.answer || "Authenticating..."}</p> // Show answer after loading
                        )
                        }
                    </div>
                </div>
            )}


            {showLogin && status === "" && (
                <div className="flex flex-col items-center mt-2">
                    <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded mb-2"
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded mb-2"
                        /><br />
                        <button onClick={handleAuthSubmit} className="bg-blue-500 text-white p-2 rounded">
                            Submit
                        </button>
                        {authError && <p className="text-red-500 mt-2">Authentication failed. Please try again.</p>}
                    </div>
                </div>
            )}

            {status === "redirecting" && (
                <div className="flex items-center mt-2 py-4">
                    <img src={logo} alt="Logo" className="w-12 h-12 mr-2 rounded-full" />
                    <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                        <p className="typing">Redirecting...</p>
                    </div>
                </div>

            )}

            {status === "typing" && (
                <div className="flex items-center justify-center mt-2">
                    <p className="typing">...</p>
                </div>
            )}

            {status === "check-status" && (
                <div className="flex flex-col items-center mt-2">
                    <input
                       type="text"
                       placeholder="Enter Ticket ID"
                       value={ticketId}
                       onChange={(e) => setTicketValues(e)}
                       className="border p-2 rounded mb-2"
                   />
                    <button onClick={handleTicketStatusSubmit} className="bg-blue-500 text-white p-2 rounded">
                        Check Status
                    </button>
                    {ticketStatus && <p className="mt-2">Your ticket id {ticketId}, is {ticketStatus}.</p>}
                    </div>
            )}

            {showCategories && (
                <div className="flex flex-col items-end mt-2 px-5 border">
                    <p className='p-2'>Welcome {companyName}!</p>
                    <div className='bg-red-500 w-60 rounded-lg py-4 text-left px-2'>
                        <button
                            onClick={() => handleCategoryClick("Product related complaint")}
                            className="bg-red-500 text-white p-2 rounded mb-2 text-left hover:bg-red-400 hover:text-black transition-colors duration-300"
                        >
                            1. Product related complaint
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Shipping related complaint")}
                            className="bg-red-500 text-white p-2 rounded mb-2 text-left hover:bg-red-400 hover:text-black transition-colors duration-300"
                        >
                            2. Shipping related complaint
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Payment related complaint")}
                            className="bg-red-500 text-white p-2 rounded mb-2 text-left hover:bg-red-400 hover:text-black transition-colors duration-300"
                        >
                            3. Payment related complaint
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Service related complaint")}
                            className="bg-red-500 text-white p-2 rounded mb-2 text-left hover:bg-red-400 hover:text-black transition-colors duration-300"
                        >
                            4. Service related complaint
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Other")}
                            className="bg-red-500 text-white p-2 rounded mb-2 text-left hover:bg-red-400 hover:text-black transition-colors duration-300 w-48"
                        >
                            5. Other
                        </button>
                    </div>
                </div>

            )}

            {showOtherInput && (
                <div className="flex flex-col items-center mt-2">
                    <input
                        type="text"
                        placeholder="Describe your complaint"
                        value={otherComplaint}
                        onChange={(e) => setOtherComplaint(e.target.value)}
                        className="border p-2 rounded mb-2"
                    />
                    <button onClick={handleOtherComplaintSubmit} className="bg-blue-500 text-white p-2 rounded">
                        Submit
                    </button>
                </div>
            )}


            {status && !["typing", "redirecting", "check-status"].includes(status) && (
                <div className="flex items-center mt-2 py-4">
                    <img src={logo} alt="Logo" className="w-12 h-12 mr-2 rounded-full" />
                    <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                        <p>{status}</p>
                    </div>
                </div>
            )}



            {/* Input box at the bottom for user to type ID */}
            <div className="mt-auto p-2 flex flex-col items-center">
                {inputValue === '7' && (
                   <div className="flex flex-col items-center mt-2">
                   <input
                       type="text"
                       placeholder="Enter Ticket ID"
                       value={ticketId}
                       onChange={(e) => setTicketValues(e)}
                       className="border p-2 rounded mb-2"
                   />
                   <button onClick={handleTicketStatusSubmit} className="bg-blue-500 text-white p-2 rounded">
                       Check Status
                   </button>
                   {ticketStatus && <p className="mt-2">Your ticket id {ticketId}, is {ticketStatus}.</p>}
               </div>
                )}

                {inputValue === '6' && (
                    <div className="flex flex-col items-center mt-2">
                        <div className="p-4 bg-white border-t border-gray-300 rounded-lg shadow-md">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border p-2 rounded mb-2"
                            />
                            <br />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border p-2 rounded mb-2"
                            /><br />
                            <button onClick={handleAuthSubmit} className="bg-blue-500 text-white p-2 rounded">
                                Submit
                            </button>
                            {authError && <p className="text-red-500 mt-2">Authentication failed. Please try again.</p>}
                        </div>
                    </div>
                )}
                <br />

                <div className='absolute bottom-6 w-full px-7 py-5'>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type ID to show message"
                    className="border p-2 rounded w-full"
                />
                </div>


            </div>

        </div>
    );
};

export default ChatInterface;
