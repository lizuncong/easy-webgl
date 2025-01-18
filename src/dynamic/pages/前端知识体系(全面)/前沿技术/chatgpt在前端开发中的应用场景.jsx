import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/前沿技术/chatgpt在前端开发中的应用场景.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;