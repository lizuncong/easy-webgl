import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    attribute float a_size;
    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
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

let x = 0;
let y = 0;
let n = 1000;
for (let i = 0; i < n; i++) {
  const r = 0.5;
  x = Math.sin(i) * r;
  y = Math.cos(i) * r;
  const a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttrib2f(a_position, x, y);

  const a_size = gl.getAttribLocation(program, "a_size");
  gl.vertexAttrib1f(a_size, 10.0);

  // 画一个点
  gl.drawArrays(gl.POINTS, 0, 1);
}
