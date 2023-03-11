import './App.css';
import './inline.css';

import React, { useState, useRef, useEffect  } from 'react';
import RenderChat from './chat-box/RenderChat';
import AutoSizeTextarea from './input-area/InputArea';
import SideMenu from './side-menu/SideMenu';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';



//    { id: 4, from: 'agent', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.?' },

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
  ]);

  function updateMessage(id, from, text) {
    setMessages(prevMessages =>
      prevMessages.map(message => {
        if (message.id === id) {
          return { ...message, from, text };
        } else {
          return message;
        }
      })
    );
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  // this is for the text input area
  const handleInputKeyDown = async (event) => {
    let text = event.target.value;
    if (text !== '') {
      if (event.keyCode === 13) {
        text = text.replace(/\n/g, '\n\n');
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
          if (newData === "/XG4=/") {
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
  // this always update the agent message only
  const regenerateMessage = async (id, text) => {
    if (text !== '') {
        try {
          const sendMessageResponse = await fetch(
            'http://localhost:8000/api/send-message',
            {
              method: 'POST',
              body: JSON.stringify({ 
                index: id,
                message: text }),
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
          if (newData === "/XG4=/") {
            newData = '';
            data += '  \n  ';
          }
          // 
          if (newData === '\0')
            eventSource.close();
          else
            data += newData;
          updateMessage(id, 'agent', data);
        };
    }
  }

  //const chatlogRef = useRef(null);

  const titlePage = (
    <h1 className='position-center text-4xl font-semibold text-center text-gray-600 ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center flex-grow'>
        ChatGPT
        <span className='bg-yellow-200 text-yellow-900 py-05 px-15 text-xs md:text-sm rounded-md uppercase'>Turbo</span>
    </h1>
  )

  const chatLogStyles = css({
    display:'flex',
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    border: 'none',
    margin: 0,
    justifyItems: 'center',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '100%',
  });

  const childrenStyle = css({
    display:'flex-inline',
    border: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
  });

  const toBottomButtonStyle = css({
    zIndex: '9999',
  })

  return (
    <div className="App">
      <SideMenu setMessages={setMessages}/>
      <section className="chatbox">
      <ScrollToBottom className={chatLogStyles.toString()} scrollViewClassName={childrenStyle.toString()} 
      followButtonClassName={toBottomButtonStyle.toString()}>
        {messages.length > 0 ? (<RenderChat messages={messages} updateMessage={updateMessage} regenerateMessage={regenerateMessage}/>) : titlePage}
        <div className="message-border"> </div>
      </ScrollToBottom>
      {AutoSizeTextarea(handleInputKeyDown, handleInputChange)}
      </section>
    </div>
  );
}

export default App;
