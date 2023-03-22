import React, { useState, useRef, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./SideMenu.css"
import { v4 as uuidv4 } from 'uuid';

import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid'

import deleteBtn from './deleteBtn';

function SideMenu(props) {
  const {setMessages, setSessionId, sessionId, sessionList, fetchSessionList} = props

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
    fetchSessionList();
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

  const handleNewchatClick = async () => {
    setMessages(
      [
        //{ id: Number, from: String, text: String },
        //{ id: 1, from: 'user', text: 'Hi there!' },
        //  { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
        //  { id: 3, from: 'user', text: 'I need help with my account' },
        //  { id: 4, from: 'agent', text: '### This is a heading\n\nThis is a paragraph with **bold** and *italic* text.' },
      ]
    )
    // set new session id
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    //#TODO Communicate with backend so that It may begin a new session
    const sendMessageResponse = fetch(
      'http://localhost:8000/api/new-chat',
      {
        method: 'POST',
        body: JSON.stringify({ 
          sessionId: newSessionId,}),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(sendMessageResponse);
    console.log("New session id: ", newSessionId);
    fetchSessionList();
  };
  /**         */
  const newchatButton = (
    <div className="newchat-button">
            <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
            <button className="newchat-click" onClick={handleNewchatClick}></button>
    </div>
  );

  // #TODO this needs some more rewrite
  const handleSessionSelect = async (selectedSessionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/get-chat-history/${selectedSessionId}`);
      const chatHistory = await response.json();
      setMessages([]);
      setMessages(chatHistory);
      setSessionId(selectedSessionId);
    } catch (error) {
      console.error('Error retrieving chat history:', error);
    }
  };

  function SessionListItem({ id, onClick }) {
    return (
      <div
        className={`session-list-item${sessionId === id ? " selected" : ""}`}
        onClick={() => onClick(id)}
      >
        <ChatBubbleLeftIcon className="input-icon" style={{ height: '24px', width: '24px', color: '#8e8ea0', padding: '4px' }}></ChatBubbleLeftIcon>
        <div className={'session-list-item-text'} children={id}></div>
        {deleteBtn({fetchSessionList, session_id: id})}
      </div>
    );
  }

  const renderSessionList = () => {
    return sessionList.map((id) => (
      <SessionListItem key={id} id={id} onClick={handleSessionSelect} />
    ));
  };

  const sidemenu = (
    <>
      {showSidemenu && (
        <aside className="sidemenu">
          {newchatButton}
          <div className="session-list">
          {renderSessionList()}
        </div>
        </aside>
      )}
      {!showSidemenu && (
        <div className={`float-sidemenu ${showFloatmenu ? 'show' : ''}`}>
          {newchatButton}
          <div className="session-list">
            {renderSessionList()}
          </div>
        </div>
      )}
      {!showSidemenu && !showFloatmenu && (
        <button className="button" onClick={handleButtonClick}> = </button>
      )}
      {!showSidemenu && showFloatmenu && (
        <button className="button" onClick={handleCloseClick}> x </button>
      )}
    </>
  );

  return (
    sidemenu
  )
}

export default SideMenu;
