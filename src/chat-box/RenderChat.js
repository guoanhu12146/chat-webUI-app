import React from 'react';
import '../App.css';
import "./codeCopyBtn.css";

import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import { Prism as Highlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {UserIcon, CubeTransparentIcon} from '@heroicons/react/24/solid';
import CodeCopyBtn from './codeCopyBtn';

function RenderChat(props) {
  const [isMarkdownMode, setIsMarkdownMode] = React.useState(false);
  //flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans
  const Pre = ({ children }) => <div className="code-pre">
        <CodeCopyBtn>{children}</CodeCopyBtn>
        {children}
    </div>

  function renderMessageText(message) {

    return (
      <ReactMarkdown children={message} parserOptions={{ commonmark: true }} remarkPlugins={[gfm]}  
        components={{
          pre: Pre,
          code({ node, inline, className = "code-bk", children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <>
                <div className="code-name"> {match[0]} </div>
                  <Highlighter
                      className="code-content"
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                  >
                      {String(children).replace(/\n$/, '')}
                  </Highlighter>
                </>
              ) : (
                  <code className={className += "inline"} {...props}>
                      {children}
                  </code>
              )
          }
        }}
      />
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
              <div className="message-avatar"> {
              message.from === 'user' ? <UserIcon style={{color:'#009fce'}} /> : <CubeTransparentIcon style={{color:'#10a37f'}} />} </div>
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