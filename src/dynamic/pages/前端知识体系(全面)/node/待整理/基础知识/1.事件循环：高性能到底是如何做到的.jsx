import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/1.事件循环：高性能到底是如何做到的.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;