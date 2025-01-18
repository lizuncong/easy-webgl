import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/electron实践/有意思的window.open.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;