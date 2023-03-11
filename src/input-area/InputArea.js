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
        rows = Math.floor(scrollHeight/24) > 5 ? 6 : Math.floor(scrollHeight/24);
        // Set the textarea element's height to the appropriate height based on the number of rows
        textareaRef.current.style.height = `${scrollHeight > 48 ? rows * 24 : 24}px`;
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

    const floatInputArea = (
        <textarea className="chat-input-textarea"
        ref={textareaRef}
        rows={rows}
        onChange={onChange}
        onKeyDown = {onKeyDown}
        style={{
          overflowY: rows > 5 ? "scroll" : "hidden",
        }}
      />
    )

    const squareInputArea = (
        <textarea className="chat-input-textarea-sq"
        ref={textareaRef}
        rows={rows}
        onChange={onChange}
        onKeyDown = {onKeyDown}
        style={{
          overflowY: rows > 5 ? "scroll" : "hidden",
        }}
      />
    )
  
    return (
        <div className="chat-input-container">
            <div className="chat-input-box">
                <div className='chat-input-area'>
                    {showFloatBar ? floatInputArea : squareInputArea}
                    <button className="input-button" onClick={handleInputClick}>
                        <PaperAirplaneIcon className="input-icon" style={{ height: '18px', width: '18px', color: '#8e8ea0', transform: 'rotate(-45deg)' }}></PaperAirplaneIcon>
                    </button>
                </div>
            </div>
        </div>
    );
  }

export default AutoSizeTextarea;