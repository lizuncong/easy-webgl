import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/最佳实践/协同模式下的冲突解决.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;