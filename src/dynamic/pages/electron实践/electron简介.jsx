import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/electron实践/electron简介.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;