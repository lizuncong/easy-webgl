import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/最佳实践/异步操作失败重试.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;