import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/待整理/实战工具/clinicjs通用性检查.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;