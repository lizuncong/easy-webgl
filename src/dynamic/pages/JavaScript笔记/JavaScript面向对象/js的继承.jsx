import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/JavaScript面向对象/js的继承.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;