import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/webpack/如何提高webpack构建速度.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;