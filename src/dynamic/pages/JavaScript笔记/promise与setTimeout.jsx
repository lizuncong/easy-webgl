import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/JavaScript笔记/promise与setTimeout.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;