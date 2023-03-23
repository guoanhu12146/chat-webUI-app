import React, { useState, useRef, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./SideMenu.css"
import { v4 as uuidv4 } from 'uuid';

import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid'

import deleteBtn from './deleteBtn';

import "../inline.css"

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
    // Communicate with backend so that It may begin a new session
    const sendMessageResponse = await fetch(
      'http://localhost:8000/api/new-chat',
      {
        method: 'POST',
        body: JSON.stringify({ 
          sessionId: newSessionId,}),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then( async () => {
      console.log("New session id: ", newSessionId);
      await fetchSessionList();
    });
  };
  /**         */
  const newchatButton = (
    <div className="newchat-button">
            <span className="newchat-span"> <FontAwesomeIcon icon={faPlus} /> </span> New chat
            <button className="newchat-click" onClick={handleNewchatClick}></button>
    </div>
  );

  const chatIcon = (
    <svg 
    stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  )

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
        <div className='w-4 h-4 ml-2 mr-2'> {chatIcon} </div>
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

  async function handleDeleteAllChat() {
    console.log("Delete all chat");
    const response = await fetch(`http://localhost:8000/api/delete-all-chat`);
    const clear = await fetchSessionList().then ( () => {
      setMessages([]);
    });
  }

  const setting = (
    <>
    <hr></hr>
    <div className="session-list-item" onClick={handleDeleteAllChat} > Delete all chat </div>
    <a className="session-list-item" > setting </a>
    <a className="session-list-item" > setting </a>
    <a className="session-list-item" > setting </a>
    <a className="session-list-item" > setting </a>
    </>
  )

  const sidemenu = (
    <>
      {showSidemenu && (
        <aside className="sidemenu">
          {newchatButton}
          <div className="session-list">
          {renderSessionList()}
        </div>
        {setting}
        </aside>
      )}
      {!showSidemenu && (
        <div className={`float-sidemenu ${showFloatmenu ? 'show' : ''}`}>
          {newchatButton}
          <div className="session-list">
            {renderSessionList()}
          </div>
          {setting}
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
