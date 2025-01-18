import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/基础知识/6.优化设计：IO方面应该要注意什么.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;