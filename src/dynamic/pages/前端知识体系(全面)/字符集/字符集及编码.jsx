import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/字符集/字符集及编码.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;