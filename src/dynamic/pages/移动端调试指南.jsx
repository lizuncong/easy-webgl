import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/移动端调试指南.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;