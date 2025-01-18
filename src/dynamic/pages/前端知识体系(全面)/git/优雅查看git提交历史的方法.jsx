import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/git/优雅查看git提交历史的方法.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;