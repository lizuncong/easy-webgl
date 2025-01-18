import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/electron实践/window.open在electron中的实践.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;