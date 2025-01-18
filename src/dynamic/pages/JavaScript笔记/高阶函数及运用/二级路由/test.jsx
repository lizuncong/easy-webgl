import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/高阶函数及运用/二级路由/test.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;