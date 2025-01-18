import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/web优化/什么是CDN.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;