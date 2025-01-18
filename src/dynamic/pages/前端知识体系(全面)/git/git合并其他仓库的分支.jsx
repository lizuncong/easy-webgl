import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/git/git合并其他仓库的分支.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;