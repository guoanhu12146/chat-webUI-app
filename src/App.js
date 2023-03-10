import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useRef, useEffect  } from 'react';
import RenderChat from './chat-box/RenderChat';

import {PaperAirplaneIcon} from '@heroicons/react/24/solid'


//    { id: 4, from: 'agent', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.?' },

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'user', text: 'Hi there!' },
    { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
    { id: 3, from: 'user', text: 'I need help with my account' },
    { id: 4, from: 'agent', text: '# This is a heading\nThis is a paragraph with **bold** and *italic* text.' },
  ]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  // this is for the text input area
  const handleInputKeyDown = async (event) => {
    let text = event.target.value;
    if (text !== '') {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.target.style.height = '24px';
        setMessages([
          ...messages,
          { id: messages.length + 1, from: 'user', text: text },
        ]);
        event.target.value = '';
  
        try {
          const sendMessageResponse = await fetch(
            'http://localhost:8000/api/send-message',
            {
              method: 'POST',
              body: JSON.stringify({ message: text }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(sendMessageResponse);
        } catch (error) {
          console.error('Error:', error);
        }
        var data = '';
        var eventSource = new EventSource('http://localhost:8000/api/get-completion-streaming');
        eventSource.onmessage = (event) => {
          let newData = event.data;
          // God knows why I need to parse it specifically
          if (newData === "XG4=") {
            newData = '';
            data += '  \n  ';
          }
          // 
          if (newData === '\0')
            eventSource.close();
          else
            data += newData;
          setMessages([
            ...messages,
            { id: messages.length + 1, from: 'user', text: text },
            { id: messages.length + 2, from: 'agent', text: data },
          ]);
        }; 
      }
    }
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  // Setup the sidemenu dynamics
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

  const handleNewchatClick = () => {
    setMessages(
      [
        { id: 1, from: 'user', text: 'Hi there!' },
        { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
        { id: 3, from: 'user', text: 'I need help with my account' },
        { id: 4, from: 'agent', text: '### This is a heading\n\nThis is a paragraph with **bold** and *italic* text.' },
      ]
    )
    //#TODO Communicate with backend so that It may begin a new session
  };

  const newchatButton = (
    <div className="newchat-button">
            <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
            <button className="newchat-click" onClick={handleNewchatClick}></button>
    </div>
  );

  const sidemenu = (
    <>
      {showSidemenu && (
        <aside className="sidemenu">
          {newchatButton}
        </aside>
      )}
      {showFloatmenu && (
        <aside className="float-sidemenu">
          {newchatButton}
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
        <RenderChat messages={messages} />
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

function AutoSizeTextarea(onKeyDown, onChange) {
  // Create a ref that will be used to get a reference to the textarea element
  const textareaRef = useRef(null);
  // Initialize the number of rows to 1
  var rows = 1

  // Use the useEffect hook to calculate the appropriate number of rows for the textarea element based on its content
  useEffect(() => {
    if (textareaRef.current) {
      // Set the textarea element's height to "auto" to measure its actual height
      textareaRef.current.style.height = "auto";
      let scrollHeight = textareaRef.current.scrollHeight;
      // Calculate the number of rows based on the textarea element's scrollHeight 
      // and the height of a single row (24 pixels in this case)
      rows = Math.floor(scrollHeight/24) > 5 ? 6 : Math.floor(scrollHeight/24);
      // Set the textarea element's height to the appropriate height based on the number of rows
      textareaRef.current.style.height = `${scrollHeight > 48 ? rows * 24 : 24}px`;
      // Set the textarea element's overflowY property to "auto" if the number of rows is greater than 5, 
      // which will enable scrolling if the content exceeds the height of the textarea element
      if (rows > 5) {
        textareaRef.current.style.overflowY = "auto"
      } else {
        textareaRef.current.style.overflowY = "hidden"
      }
    }
  });

  // send a simulated key press event for the Enter key to the textarea element
  // so it can be used for sending user input to API
  function handleInputClick() {
    const textarea = textareaRef.current;
    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    textarea.dispatchEvent(enterKeyEvent);
  }

  return (
    <div className='chat-input-area'>
    <textarea className="chat-input-textarea"
      ref={textareaRef}
      rows={rows}
      onChange={onChange}
      onKeyDown = {onKeyDown}
      style={{
        overflowY: rows > 5 ? "scroll" : "hidden",
      }}
    />
    <button className="input-button" onClick={handleInputClick}> 
      <PaperAirplaneIcon className="input-icon" style={{height:'18px', width:'18px',color:'#8e8ea0', transform: 'rotate(-45deg)'}}></PaperAirplaneIcon>
     </button>
    </div>
  );
}


export default App;
