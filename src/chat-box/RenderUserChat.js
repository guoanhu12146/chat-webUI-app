import React, { useState, useRef, useEffect  } from 'react';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import './userchat.css'

export default function RenderUserMessageText(props) {
    const {message, updateMessage} = props;
    let id = message.id;
    let from = message.from;
    let value = message.text;
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value);

    const handleInputChange = (event) => {
      setText(event.target.value);
    };
  
    const handleSaveClick = () => {
        value = text;
        console.log(value);
        updateMessage(id, from, value);
        setEditing(false);
    };
  
    if (editing) {
      return (
        <div className="user-message-text">
          <textarea className="edit-area" value={text} onChange={handleInputChange} />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      );
    } else {
      return (
        <div className="user-message-text">
          <ReactMarkdown children={value} parserOptions={{ commonmark: true }} remarkPlugins={[gfm]}  />
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      );
    }
}