import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/web优化/高性能浏览器网络.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;