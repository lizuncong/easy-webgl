import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/手写实现bind.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;