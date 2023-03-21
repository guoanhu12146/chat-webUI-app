import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import './userchat.css'

export default function RenderUserMessageText(props) {
    const {message, updateMessage, regenerateMessage} = props;
    let id = message.id;
    let from = message.from;
    let value = message.text;
    const [editing, setEditing] = useState(false);
    const [inputText, setInputText] = useState(value);

    const handleInputChange = (event) => {
      setInputText(event.target.value);
    };
  
    const handleSaveClick = () => {
        value = inputText;
        console.log(value);
        updateMessage(id, from, value);
        regenerateMessage(id+1, value);
        setEditing(false);
    };

    const handleCancel = () => {
      setInputText(value);
      setEditing(false);
    }

    const textareaRef = useRef(null);

    // duplicate for user input
    useEffect (() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset the height to auto to recalculate the height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the height based on the content
      }
    }, [inputText]);

    const handleEdit = () => {
      setEditing(true);
      // sanitize text also update textarea viewport, how awesome
      console.log(value);
      value = value.replace(/\n\n/g, '\n');
      value = value.append('a');
      setInputText(value);
    }
  
    if (editing) {
      return (
        <div className="user-message-text">
          <textarea className="edit-area" value={inputText} onChange={handleInputChange}  ref={textareaRef} rows={1}/>
          <div className='button-container'> 
              <button className="btn save-button" onClick={handleSaveClick}> Save&Submit </button> 
              <button className="btn cancel-button" onClick={handleCancel}> Cancel </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="user-message-text">
          <ReactMarkdown children={value} parserOptions={{ commonmark: true }} remarkPlugins={[gfm]}  />
          <div className='button-container'> 
          <button className="btn edit-button" onClick={handleEdit }><FontAwesomeIcon icon={faEdit} /></button> 
          </div>
        </div>
      );
    }
}