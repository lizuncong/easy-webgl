import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/学习计划/如何学习一门新技术.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;