import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/javaScript/常用设计模式汇总.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;