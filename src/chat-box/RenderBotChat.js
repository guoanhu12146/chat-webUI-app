import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { Prism as Highlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import CodeCopyBtn from './codeCopyBtn';

    

export default function RenderBotMessageText(props) {

    const {message, updateMessage} = props

    let text = message.text

    const Pre = ({ children }) => <div className="code-pre">
        <CodeCopyBtn>{children}</CodeCopyBtn>
        {children}
    </div>

    return (
      <ReactMarkdown children={text} parserOptions={{ commonmark: true }} remarkPlugins={[gfm]}  
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
                  <Highlighter
                      className="code-content-inline"
                      style={vscDarkPlus}
                      customStyle={{background: 'transparent', fontsize:"15px"}}
                      useInlineStyles={true}
                      PreTag="code"
                      {...props}
                  >
                      {String(children).replace(/\n$/, '')}
                  </Highlighter>
              )
          }
        }}
      />
    );
}