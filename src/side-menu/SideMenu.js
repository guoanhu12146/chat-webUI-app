import React, { useState, useRef, useEffect  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./SideMenu.css"

function SideMenu(props) {
const {setMessages} = props

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
        //{ id: Number, from: String, text: String },
        { id: 1, from: 'user', text: 'Hi there!' },
          { id: 2, from: 'agent', text: 'Hello, how can I help you?' },
          { id: 3, from: 'user', text: 'I need help with my account' },
          { id: 4, from: 'agent', text: '### This is a heading\n\nThis is a paragraph with **bold** and *italic* text.' },
      ]
    )
    //#TODO Communicate with backend so that It may begin a new session
    const sendMessageResponse = fetch(
      'http://localhost:8000/api/new-chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(sendMessageResponse);
  };
  /**         */
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

  return (
    sidemenu
  )
}

export default SideMenu;