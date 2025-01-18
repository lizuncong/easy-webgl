import React from "react";
  import MarkDown from "@/components/markdown";
  import shape from "@docs/前端知识体系(全面)/浏览器渲染/CRP关键渲染路径-从输入URL到页面呈现都发生了什么.md";
  
  function Index() {
    return <MarkDown src={shape} />;
  }
  
  export default Index;