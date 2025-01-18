import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/electron实践/window.open和BrowserWindow内存开销对比.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;