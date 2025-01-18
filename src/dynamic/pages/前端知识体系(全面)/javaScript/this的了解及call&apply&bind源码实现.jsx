import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/javaScript/this的了解及call&apply&bind源码实现.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;