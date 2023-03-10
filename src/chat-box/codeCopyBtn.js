import React from "react";
import "./codeCopyBtn.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faCopy } from '@fortawesome/free-solid-svg-icons';


// Written by https://designly.biz/blog/post/react-markdown-how-to-create-a-copy-code-button
export default function CodeCopyBtn({ children }) {
    const [copyOk, setCopyOk] = React.useState(false);

    const iconColor = copyOk ? '#0af20a' : '#ddd';
    const checkSqaure = ( <FontAwesomeIcon icon={faCheckSquare} />)
    const copy = (<FontAwesomeIcon icon={faCopy} />)
    const icon = copyOk ? checkSqaure : copy;

    const handleClick = (e) => {
        navigator.clipboard.writeText(children[0].props.children[0]);
        console.log(children)

        setCopyOk(true);
        setTimeout(() => {
            setCopyOk(false);
        }, 500);
    }

    return (
        <div className="code-copy-btn">
            {icon}
            <button className="code-real-btn" onClick={handleClick} style={{color: iconColor}}  />
        </div>
    )
}
