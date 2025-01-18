import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/JavaScript面向对象/对象的属性.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;