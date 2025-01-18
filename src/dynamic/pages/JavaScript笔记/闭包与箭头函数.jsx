import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/闭包与箭头函数.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;