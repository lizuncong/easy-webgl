
    import React from "react";
    import { Spin } from 'antd';
    const A_be4dc60754ae5d5061836d6482e1a454 = React.lazy(() => import(/* webpackChunkName: "A000" */ "@/dynamic/pages/基础知识/test"));

    const routes = [
{
             path: "/基础知识/test",
             element: (
                <React.Suspense fallback={<div className="loading"><Spin size="large" /></div>}>
                <A_be4dc60754ae5d5061836d6482e1a454 />
                </React.Suspense>
             ),
           },

]

    export default routes;
    