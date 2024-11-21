import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import axios from 'axios'

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loader,setLoader] = useState(false)

  const handleSend = async() => {
    setLoader(true)
    if (userInput.trim()) {
      try {
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: userInput },
        ]);
        let question = userInput;
        setUserInput("");
  
        // setTimeout(() => {
        //   setMessages((prev) => [
        //     ...prev,
        //     { sender: "bot", text: "Thank you! I'm here to help." },
        //   ]);
        // }, 1000);
  
        let response = await axios.post('http://localhost:3000/query', {question})
        console.log(response.data)
        setMessages((prev) => {
          return [...prev, { sender: "bot", text: response.data.message, data : response.data.data }]
        })
  
      } catch (error) {
        console.log(error)
      }
    }
    setLoader(false)
  };

  function handleSendMessage(e) {
    if(e.key === 'Enter') {
      // alert('working to')
      handleSend()
    }
    
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-white to-purple-100 flex items-center justify-center text-gray-800">
      <motion.div
        className="w-full max-w-md bg-white shadow-md rounded-xl flex flex-col h-[80vh] overflow-hidden border border-purple-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="py-4 px-6 bg-gradient-to-r from-purple-200 to-white border-b border-purple-300">
          <motion.h1
            className="text-center text-xl font-semibold text-purple-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Chat with OOW Bot
          </motion.h1>
        </div>

        {/* Chat Area */}
        <motion.div
          className="flex-grow overflow-y-auto p-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2 shadow-md">
                  🤖
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg text-sm shadow ${
                  message.sender === "bot"
                    ? "bg-purple-50 text-purple-800"
                    : "bg-purple-100 text-purple-900"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
          {
            loader && <>
              <motion.div

              className={`flex justify-start`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
            
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2 shadow-md">
                  🤖
                </div>

              <div
                className={`px-4 py-2 rounded-lg text-sm shadow bg-purple-50 text-purple-800  `} >
                typing...
              </div>
            </motion.div>
            </>
          }
        </motion.div>

        {/* Input Area */}
        <motion.div
          className="bg-white py-3 px-4 flex items-center space-x-3 border-t border-purple-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleSendMessage}
            placeholder="Type a message..."
            className="flex-grow bg-purple-50 text-purple-800 placeholder-purple-400 px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            disabled={loader}
            onClick={handleSend}
            className="bg-purple-500 text-white p-3 rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <FiSend size={20} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;
