import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/网络/http协议及各版本的差别.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;