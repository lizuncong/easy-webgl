import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/8.系统稳定：如何监控和保护进程安全.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;