import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = ({ isLoggedIn, userName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // Clear chats only when user logs out
    useEffect(() => {
        if (!isLoggedIn) {
            setMessages([]);
        }
    }, [isLoggedIn]);

    // Add greeting when bot is opened
    useEffect(() => {
        setMessages([]);
    }, [isLoggedIn]); // This will clear chat when auth state changes in either direction

    // Add greeting when bot is opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = isLoggedIn 
                ? `Hello ${userName}! How can I help you with internship and jobs?`
                : "Hello! How can I help you with internships and jobs?";
            setMessages([{ text: greeting, isBot: true }]);
        }
    }, [isOpen, isLoggedIn, userName, messages.length]); // Removed messages.length from dependencies

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const newMessage = { text: inputMessage, isBot: false };
        setMessages(prev => [...prev, newMessage]);
        
        try {
            const response = await axios.post('https://intern-area.onrender.com/api/chatbot/ask', {
                question: inputMessage,
                username: userName
            });

            // Add bot response
            setMessages(prev => [...prev, { 
                text: response.data.response, 
                isBot: true 
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                text: "Sorry, I'm having trouble responding. Please try again later.", 
                isBot: true 
            }]);
        }
        
        setInputMessage('');
    };


    return (
        <div className="fixed bottom-8 right-8 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 rounded-lg shadow-xl border border-gray-200">
                    <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">ChatBot</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="hover:text-blue-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="h-96 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div 
                                key={index}
                                className={`mb-4 ${msg.isBot ? 'text-left' : 'text-right'}`}
                            >
                                <div
                                    className={`inline-block p-3 rounded-lg ${
                                        msg.isBot 
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-500 text-white'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
