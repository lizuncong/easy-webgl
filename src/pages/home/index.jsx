import React from "react";
import MarkDown from "@/components/markdown";
import shape from '@docs/属性和缓冲/属性的赋值方式.md'

function Index() {
  return <div className="home">
    <div>首页</div>
    <MarkDown src={shape} />
  </div>;
}

export default Index;

        