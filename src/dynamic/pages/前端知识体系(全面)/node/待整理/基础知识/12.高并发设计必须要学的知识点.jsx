import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/12.高并发设计必须要学的知识点.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;