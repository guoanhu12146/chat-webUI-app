import './App.css';
import './inline.css';

import React, { useState, useRef, useEffect  } from 'react';
import RenderChat from './chat-box/RenderChat';
import AutoSizeTextarea from './input-area/InputArea';
import SideMenu from './side-menu/SideMenu';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';

import { v4 as uuidv4 } from 'uuid';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
  ]);

  // set up the session id
  const [sessionId, setSessionId] = useState(uuidv4());
  const [sessionList, setSessionList] = useState([]);

  const init_id = sessionId;

  function updateMessage(id, from, text) {
    setMessages(prevMessages =>
      prevMessages.map(message => {
        if (message.id === id) {
          return { ...message, from, text };
        } 
        else if (message.id > id+1) {
          return null
        }
        else {
          return message;
        }
      }).filter(message => message !== null) // filter out null messages
    );
  }

  const fetchSessionList = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-session-list");
      const sessionListData = await response.json();
      setSessionList(sessionListData);
    } catch (error) {
      console.error("Error fetching session list:", error);
    }
  };

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

        let newSession = false;
        if (sessionId === init_id) {
          newSession = true;
          console.log(sessionId);
        }
  
        try {
          const sendMessageResponse = await fetch(
            'http://localhost:8000/api/send-message',
            {
              method: 'POST',
              body: JSON.stringify({ message: text , sessionId: sessionId}),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(sendMessageResponse);
        } catch (error) {
          console.error('Error:', error);
        }
        //
        await fetchCompletionData(messages.length + 1, false, text);
        if (newSession) {
          console.log("fetching session list");
          fetchSessionList();
        }
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
            'http://localhost:8000/api/branch-chat',
            {
              method: 'POST',
              body: JSON.stringify({ 
                index: id,
                message: text,
                sessionId: sessionId }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(sendMessageResponse);
        } catch (error) {
          console.error('Error:', error);
        }
        await fetchCompletionData(id, true, '');
    }
  }

  async function fetchCompletionData(id, update, text) {
      var data = '';
      var eventSource = new EventSource(`http://localhost:8000/api/get-completion-streaming/${sessionId}`);
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
        if (update)
          updateMessage(id, 'agent', data);
        else
          setMessages([
            ...messages,
            {id: id, from: 'user', text: text},
            { id: id+1, from: 'agent', text: data },
          ]);
      };
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
      <SideMenu setMessages={setMessages} setSessionId={setSessionId} sessionId={sessionId} sessionList={sessionList} fetchSessionList={fetchSessionList}/>
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
