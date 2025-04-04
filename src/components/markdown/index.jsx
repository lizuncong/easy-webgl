import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "./highLighter";
import rehypeRaw from "rehype-raw";
// import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css";

import "./index.less";

function Shapes({ src, srcDoc }) {
  const [mdText, setMdText] = useState("");
  useEffect(() => {
    if (srcDoc) {
      setMdText(srcDoc)
      return;
    }
    fetch(src)
      .then((response) => response.text())
      .then((text) => {
        setMdText(text);
      });
  }, [src, srcDoc]);
  return (
    <div className="markdown-body">
      <ReactMarkdown
        children={mdText}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                className="my-code"
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}

export default Shapes;
