import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/踩坑系列/png序列帧动画首次闪烁的问题.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;