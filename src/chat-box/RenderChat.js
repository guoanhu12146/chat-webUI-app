import React from 'react';
import '../App.css';
import '../inline.css';
import "./codeCopyBtn.css";
import './RenderChat.css';

import {UserIcon, CubeTransparentIcon} from '@heroicons/react/24/solid';
import myLogo from '../userIcon.webp'
import aiLogo from '../chatgpt-icon.svg'

import RenderBotMessageText from './RenderBotChat'
import RenderUserMessageText from './RenderUserChat';

function RenderChat(props) {
  
  //flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans
  

  const { messages, updateMessage, regenerateMessage} = props;

  const chatgptIcon = (
      <div className='bot-icon'>
        <img className='bot-icon-svg' src={aiLogo}></img>
      </div>
  )


  const myIcon = (
    <img alt="G"
      src={myLogo}
      className="rounded-sm h-30 w-30"></img>
  )

  const userIcon = (
    <div className='user-icon'>
      G
    </div>
  )

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-message ${
            message.from === 'user' ? 'from-user' : 'from-agent'
          }`}
        >
          <div className="message-border">
            <div className="message-container">
              <div className="message-avatar"> {
              message.from === 'user' ? userIcon : chatgptIcon } </div>
              <div className="message-text">
              {message.from === 'user'
                ? <RenderUserMessageText message={message} updateMessage={updateMessage}  regenerateMessage={regenerateMessage}/>
                : <RenderBotMessageText message={message}  updateMessage={updateMessage} />}
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RenderChat;