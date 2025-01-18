import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/最佳实践/resolvablePromise.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;