import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/加密算法/RSA算法流程概述.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;