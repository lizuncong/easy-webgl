import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/node/cluster集群模式.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;