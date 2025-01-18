import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/electron实践/ipc通信.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;