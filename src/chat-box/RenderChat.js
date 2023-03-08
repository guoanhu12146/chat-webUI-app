import React from 'react';
import '../App.css';

import ReactMarkdown from "react-markdown";

function RenderChat(props) {
  const [isMarkdownMode, setIsMarkdownMode] = React.useState(false);
  function renderMessageText(message) {

    return (
      <ReactMarkdown children={message} parserOptions={{ commonmark: true }} />
    );
  }

  const { messages } = props;

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
              <div className="message-avatar"> {message.from[0]} </div>
              <div className="message-text">
                {renderMessageText(message.text)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RenderChat;