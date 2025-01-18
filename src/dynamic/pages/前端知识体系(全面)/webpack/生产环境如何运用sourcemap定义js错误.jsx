import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/webpack/生产环境如何运用sourcemap定义js错误.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;