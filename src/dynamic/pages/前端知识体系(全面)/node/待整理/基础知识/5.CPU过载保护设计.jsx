import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/5.CPU过载保护设计.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;