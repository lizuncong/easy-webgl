import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/基础知识/test.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;