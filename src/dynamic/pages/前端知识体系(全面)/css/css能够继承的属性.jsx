import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/css/css能够继承的属性.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;