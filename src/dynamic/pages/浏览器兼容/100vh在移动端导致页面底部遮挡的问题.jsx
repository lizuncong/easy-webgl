import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/浏览器兼容/100vh在移动端导致页面底部遮挡的问题.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;