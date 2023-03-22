import React, { useState, useRef, useEffect  } from 'react';
import {PaperAirplaneIcon} from '@heroicons/react/24/solid'


import "./InputArea.css"

function AutoSizeTextarea(onKeyDown, onChange) {
    // Create a ref that will be used to get a reference to the textarea element
    const textareaRef = useRef(null);
    const [showFloatBar, setshowFloatBar] = useState(false);
    // Initialize the number of rows to 1
    var rows = 1
  
    // Use the useEffect hook to calculate the appropriate number of rows for the textarea element based on its content
    useEffect(() => {
      if (textareaRef.current) {
        // Set the textarea element's height to "auto" to measure its actual height
        textareaRef.current.style.height = "auto";
        let scrollHeight = textareaRef.current.scrollHeight;
        // Calculate the number of rows based on the textarea element's scrollHeight 
        // and the height of a single row (24 pixels in this case)
        rows = Math.floor(scrollHeight/24) > 6 ? 7 : Math.floor(scrollHeight/24);
        // Set the textarea element's height to the appropriate height based on the number of rows
        textareaRef.current.style.height = `${rows * 24 }px`;
        // Set the textarea element's overflowY property to "auto" if the number of rows is greater than 5, 
        // which will enable scrolling if the content exceeds the height of the textarea element
        if (rows > 5) {
          textareaRef.current.style.overflowY = "auto"
        } else {
          textareaRef.current.style.overflowY = "hidden"
        }
      }
    });

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 768) {
            setshowFloatBar(true);
          } else {
            setshowFloatBar(false);
          }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
  
    // send a simulated key press event for the Enter key to the textarea element
    // so it can be used for sending user input to API
    function handleInputClick() {
      const textarea = textareaRef.current;
      const enterKeyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      textarea.dispatchEvent(enterKeyEvent);
    }

    const btnIcon = (
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
      stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    )

    const inputbtn = (
      <div className='inputbtn-container'>
        <button className="input-button" onClick={handleInputClick} >
          {btnIcon}
        </button>
      </div>
    )

    const floatInputArea = (
      <div className='chat-input-area'>
        <textarea className="chat-input-textarea"
        ref={textareaRef}
        rows={1}
        onChange={onChange}
        onKeyDown = {onKeyDown}
        style={{
          overflowY: rows > 5 ? "scroll" : "hidden",
        }}
      />
      {inputbtn}
      </div>
    )

    const squareInputArea = (
      <div className='chat-input-area box'>
      <textarea className="chat-input-textarea"
        ref={textareaRef}
        rows={1}
        onChange={onChange}
        onKeyDown = {onKeyDown}
        style={{
          overflowY: rows > 5 ? "scroll" : "hidden",
        }}
      />
      {inputbtn}
      </div>
    )
  
    return (
        <div className="chat-input-container">
            <div className="chat-input-box"> 
              {showFloatBar ? floatInputArea : squareInputArea}
            </div>
        </div>
    );
  }

export default AutoSizeTextarea;