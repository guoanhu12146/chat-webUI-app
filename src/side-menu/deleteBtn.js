import "./deleteBtn.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function deleteBtn({fetchSessionList, session_id}) {
    const handleDeleteClick = async () => {
        console.log('delete button clicked');
        // pop up a modal to confirm delete
        // if confirmed, delete the session
        // if not, do nothing
        const confirmed = window.confirm('Are you sure you want to delete this session?');
        if (confirmed) {
          fetch('http://localhost:8000/api/delete-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: session_id })
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            fetchSessionList();
          })
          .catch(error => console.error(error));
        }
    };
    return (
        <div className="delete-btn">
            <button className="delete-btn" onClick={handleDeleteClick}> 
                <FontAwesomeIcon icon={faTrash} className='delete-icon' />
             </button>
        </div>
    )
};

export default deleteBtn;