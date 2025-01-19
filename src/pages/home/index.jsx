import React from "react";
import shape from '../../../README.md'
import MarkDown from "@/components/markdown";

function Index() {
  return <div className="home">
    <div>首页</div>
    <MarkDown src={shape}/>
  </div>;
}

export default Index;

        