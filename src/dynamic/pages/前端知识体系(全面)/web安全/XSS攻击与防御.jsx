import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/web安全/XSS攻击与防御.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;