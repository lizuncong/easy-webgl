import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/JavaScript面向对象/class和js普通构造函数.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;