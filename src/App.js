import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';



function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'user', text: 'Hi there!' },
    { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
    { id: 3, from: 'user', text: 'I need help with my account' },
    { id: 4, from: 'agent', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.?' },
    { id: 5, from: 'user', text: '# This is a heading\n\nThis is a paragraph with **bold** and *italic* text.' },
  ]);

  const md = new MarkdownIt(); // create a new instance of the MarkdownIt parser

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // this is for the text input area
  const handleInputKeyDown = (event) => {
    if (event.target.value != '') {
      if (event.key === 'Enter') {
        event.target.style.height = '24px';
        setMessages([
          ...messages,
          { id: messages.length + 1, from: 'user', text: inputValue },
        ]);
        setInputValue('');
      }
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };
  // size adjustment for the text input area
  const handleTextareaInput = (event) => {
    if (event.target.scrollHeight === 48) {
    event.target.style.height = '24px';
    } else {
      event.target.style.height = event.target.scrollHeight + 'px';
    }
    if (event.target.value === '') {
      event.target.style.height = '24px';
    }
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className = "newchat-button">
          <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
        </div>
      </aside>
      <section className = "chatbox">
        <div className="chat-log">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.from === 'user' ? 'from-user' : 'from-agent'
              }`}
            >
              <div className="message-border">
                <div className="message-container">   
                  <div className="message-avatar"> {message.from[0]} </div>
                  <div className="message-text">
                    <div
                        dangerouslySetInnerHTML={{ __html: md.render(message.text) }}
                      />
                  </div>  
                </div>
              </div>
            </div>
          ))}
          <div className="message-border"> </div>
        </div>
        <div className="chat-input-container">
          <div className="chat-input-box">
            <textarea
              className="chat-input-textarea"
              placeholder=""
              rows="1"
              value={inputValue}
              onInput={handleTextareaInput}
              onKeyDown={handleInputKeyDown}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
