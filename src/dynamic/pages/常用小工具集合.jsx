import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/常用小工具集合.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;