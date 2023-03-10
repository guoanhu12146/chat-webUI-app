import React from 'react';
import '../App.css';
import "./codeCopyBtn.css";

import {UserIcon, CubeTransparentIcon} from '@heroicons/react/24/solid';

import RenderBotMessageText from './RenderBotChat'
import RenderUserMessageText from './RenderUserChat';

function RenderChat(props) {
  
  //flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans
  

  const { messages, updateMessage } = props;

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
              message.from === 'user' ? <UserIcon style={{color:'#009fce'}} /> : <CubeTransparentIcon style={{color:'#10a37f'}} />} </div>
              <div className="message-text">
              {message.from === 'user'
                ? <RenderUserMessageText message={message} updateMessage={updateMessage} />
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