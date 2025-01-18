import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/2.Node作为后台可以提供哪些服务.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;