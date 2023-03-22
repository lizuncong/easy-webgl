import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    void main(){
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

let fragmentSource = `
    void main(){
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

console.log("program...", program);
// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
