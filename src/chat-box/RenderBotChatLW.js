import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Highlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import CodeCopyBtn from './codeCopyBtn';

const RenderBotMessageTextLW = ({ text }) => {


  return (
    <ReactMarkdown
      children={text}
      plugins={[gfm]}
    />
  );
};

export default RenderBotMessageTextLW;
