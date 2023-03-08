import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useRef, useEffect  } from 'react';
import MarkdownIt from 'markdown-it';

//    { id: 4, from: 'agent', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.?' },

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'user', text: 'Hi there!' },
    { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
    { id: 3, from: 'user', text: 'I need help with my account' },
    { id: 4, from: 'agent', text: '# This is a heading\n\nThis is a paragraph with **bold** and *italic* text.' },
  ]);

  const md = new MarkdownIt(); // create a new instance of the MarkdownIt parser

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // this is for the text input area
  const handleInputKeyDown = (event) => {
    let text = event.target.value;
    if ( text !== "") {
      if (event.keyCode === 13) {
        event.target.style.height = "24px";
        setMessages([
          ...messages,
          { id: messages.length + 1, from: "user", text: text },
        ]);
        event.target.value = ''

        fetch('http://localhost:8000/api/send-message', {
          method: 'POST',
          body: JSON.stringify({ message: text }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((sendMessageResponse) => {
          console.log(sendMessageResponse);
          return fetch('http://localhost:8000/api/get-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        })
        .then((completionResponse) => {
          console.log(completionResponse);
          return completionResponse.json();
        })
        .then((data) => {
          console.log(data);
          setMessages([
            ...messages,
            { id: messages.length + 1, from: 'user', text: text },
            { id: messages.length + 2, from: 'agent', text:data },
          ]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    }
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const [showSidemenu, setShowSidemenu] = useState(false);
  const [showFloatmenu, setFloatmenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSidemenu(true);
      } else {
        setShowSidemenu(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButtonClick = () => {
    setFloatmenu(true);
  };

  const handleCloseClick = () => {
    setFloatmenu(false);
  };

  const sidemenu = (
    <>
      {showSidemenu && (
        <aside className="sidemenu">
          <div className="newchat-button">
            <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
          </div>
        </aside>
      )}
      {showFloatmenu && (
        <aside className="float-sidemenu">
          <div className="newchat-button">
            <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
          </div>
        </aside>
      )}
      {!showSidemenu && !showFloatmenu && (
        <button className="button" onClick={handleButtonClick}> = </button>
      )}
      {!showSidemenu && showFloatmenu && (
        <button className="button" onClick={handleCloseClick}> x </button>
      )}
    </>
  );

  const chatlogRef = useRef(null);
  const [completion, setCompletion] = useState('');

  return (
    <div className="App">
      {sidemenu}
      <section className="chatbox">
      <div className="chat-log" ref={chatlogRef}>
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
      <div> {completion} </div>
      <div className="message-border"> </div>
      </div>
        <div className="chat-input-container">
          <div className="chat-input-box">
            {AutoSizeTextarea(handleInputKeyDown, handleInputChange)}
          </div>
        </div>
      </section>
    </div>
  );
}

function handleKeyDown(event) {
  if (event.keyCode === 13) { // check if Enter key was pressed
    event.preventDefault(); // prevent default behavior (adding a new line)
    event.target.value = ''; // clear textarea's content
  }
}

function AutoSizeTextarea(onKeyDown, onChange) {
  const textareaRef = useRef(null);
  var rows = 1

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      let scrollHeight = textareaRef.current.scrollHeight;
      rows = Math.floor(scrollHeight/24) > 5 ? 6 : Math.floor(scrollHeight/24);
      textareaRef.current.style.height = `${scrollHeight > 48 ? rows * 24 : 24}px`;
      // 
      if (rows > 5) {
        textareaRef.current.style.overflowY = "auto"
      } else {
        textareaRef.current.style.overflowY = "hidden"
      }
    }
  });


  return (
    <textarea className = "chat-input-textarea"
      ref={textareaRef}
      rows={rows}
      onChange={onChange}
      onKeyDown = {onKeyDown}
      style={{
        overflowY: rows > 5 ? "scroll" : "hidden",
      }}
    />
  );
}

export default App;
