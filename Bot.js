import axios from 'axios';
import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // User message
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // API details
    const apiUrl = 'https://kdrqgcjti8-vpce-09f1581cc2b1451de.execute-api.us-west-2.amazonaws.com/UAT/RAG-fn';
    const params = {
      model_arn: 'arn:aws:bedrock:us-west-2:your-model-arn',
      grid: 'lddkabz0w232',
      kbid: 'TV3DGDCPZS',
      query: input,
    };

    try {
      const response = await axios.get(apiUrl, { params });
      const botMessage = { text: response.data.response || 'No response from model.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const botMessage = { text: 'Error: Unable to fetch response. Please try again later.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }

    setInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior of Enter key (new line)
      handleSendMessage();   // Send the message
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Chatbot</h2>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={3}  // Set number of visible rows
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
