import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main(){
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

let fragmentSource = `
    precision mediump float;
    varying vec3 v_color;
    void main(){
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

// let vertices = [
//     // x y  r g b 前面两个代表坐标，后面三个代表颜色rgb的值
//     -0.5, 0.5, 1.0, 0.0, 0.0,
//     -0.5,-0.5, 0.0, 1.0, 0.0,
//     0.5, -0.5, 0.0, 0.0, 1.0,
//     0.5, 0.5,  1.0, 1.0, 0.0,
// ];
let n = 60;
let vertices = [];

// 随机生成n个点
// for (let i = 0; i < n; i++) {
//   let x = (Math.random() - 0.5) * 2;
//   let y = (Math.random() - 0.5) * 2;
//   let r = (Math.random() - 0.5) * 2;
//   let g = (Math.random() - 0.5) * 2;
//   let b = (Math.random() - 0.5) * 2;
//   vertices.push(x, y, r, g, b);
// }

// 使用三角形生成一个圆
const radius = 0.5; // 圆的半径
for (let i = 0; i < n; i++) {
  let deg = ((2 * Math.PI) / n) * i;
  const x = Math.cos(deg) * radius;
  const y = Math.sin(deg) * radius;

  let r = (Math.random() - 0.5) * 2;
  let g = (Math.random() - 0.5) * 2;
  let b = (Math.random() - 0.5) * 2;
  vertices.push(x, y, r, g, b);
}

vertices = new Float32Array(vertices);
console.log("vertices===", vertices);
const FSIZE = vertices.BYTES_PER_ELEMENT; // 4
/**
 * buffer：分5个步骤
 * **/
//1
const buffer = gl.createBuffer();
//2 绑定buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 3
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
// 4把带有数据的buffer赋值给attribute
const a_position = gl.getAttribLocation(program, "a_position");
const a_color = gl.getAttribLocation(program, "a_color");
// 定义点的信息
gl.vertexAttribPointer(
  a_position,
  2, // size，attribute变量的长度(vec2)
  gl.FLOAT, // type, buffer的数据类型
  false,
  5 * FSIZE, // 每个点的信息所占的bytes
  0
);
gl.vertexAttribPointer(
  a_color,
  3, // size，attribute变量的长度(vec3)
  gl.FLOAT,
  false,
  5 * FSIZE,
  2 * FSIZE
);
// 5 确认赋值
gl.enableVertexAttribArray(a_position);
gl.enableVertexAttribArray(a_color);

/**
 * WebGL中的基本形状：点、线、三角形
 * 点：1种类型 gl.POINTS
 * 线：3种类型 gl.LINES、gl.LINE_STRIP、gl.LINE_LOOP
 * 三角形：3种类型 gl.TRIANGLES、gl.TRIANGLE_STRIP、gl.TRIANGLES_FAN
 **/

// gl.drawArrays(gl.POINTS, 0, n);

// gl.drawArrays(gl.LINES, 0, n);
// gl.drawArrays(gl.LINE_STRIP, 0, n)
// gl.drawArrays(gl.LINE_LOOP, 0, n)

// 第一个参数指明绘制什么图形，第二个参数指定从哪个点开始绘制，第三个参数指定一共绘制多少个点
// gl.drawArrays(gl.TRIANGLES, 0, n);
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
