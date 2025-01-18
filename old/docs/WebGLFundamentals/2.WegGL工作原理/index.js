import initShaders from "./initShaders.js";
import { resize } from './utils.js'

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec2 a_position;
  attribute float a_position2;
  attribute vec4 a_color;
  uniform vec2 u_resolution;
  varying vec4 v_color;
  // 所有着色器都有一个main方法
  void main() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position/ u_resolution;

    // 再把 0 -> 1 转换 0 -> 2
    vec2 zeroToTwo = zeroToOne * a_position2;

    // 把0 -> 2转换到-1 -> +1(裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    

    // 直接把属性值中的数据赋给可变量
    v_color = a_color;

  }
`;

let fragmentSource = `
  // 片段着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
  varying vec4 v_color;
  void main() {
    // gl_FragColor是一个片段着色器主要设置的变量
    gl_FragColor = v_color;
  }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionAttributeLocation2 = gl.getAttribLocation(program, "a_position2");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorLocation = gl.getAttribLocation(program, "a_color");
// attribute的赋值不需要在useProgram之后
gl.vertexAttrib1f(positionAttributeLocation2, 2.0)
// unifrom的赋值需要在useProgram之后，下面的赋值会出错
// gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

console.log("program...", gl.getParameter(gl.MAX_VERTEX_ATTRIBS), colorLocation, positionAttributeLocation2, positionAttributeLocation, resolutionUniformLocation);

var positionBuffer = gl.createBuffer();
// 可以看成ARRAY_BUFFER = positionBuffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

setGeometry(gl)

var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// Set the colors.
setColors(gl);

/**************************在此之上的代码是 初始化代码。这些代码在页面加载时只会运行一次***********************************************/
/**************************接下来的代码是渲染代码，而这些代码将在我们每次要渲染或者绘制时执行***********************************************/


const drawScene = () => {
  resize(gl.canvas)
  // 告诉WebGL裁剪空间的 -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 
  // y轴的 0 -> gl.canvas.height
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空canvas画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program)


  gl.enableVertexAttribArray(positionAttributeLocation);
  // 将绑定点绑定到缓冲数据（positionBuffer）
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  var size = 2;          // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0;        // 从缓冲起始位置开始读取

  // 一个隐藏信息是gl.vertexAttribPointer是将属性绑定到当前的ARRAY_BUFFER。 
  // 换句话说就是属性绑定到了positionBuffer上。这也意味着现在利用绑定点随意将 
  // ARRAY_BUFFER绑定到其它数据上后，该属性依然从positionBuffer上读取数据。
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)



  // Turn on the color attribute
  gl.enableVertexAttribArray(colorLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  var size = 4;          // 4 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorLocation, size, type, normalize, stride, offset);


  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}


drawScene()


function setColors(gl) {
  // Make every vertex a different color.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      [Math.random(), Math.random(), Math.random(), 1,
      Math.random(), Math.random(), Math.random(), 1,
      Math.random(), Math.random(), Math.random(), 1,
      Math.random(), Math.random(), Math.random(), 1,
      Math.random(), Math.random(), Math.random(), 1,
      Math.random(), Math.random(), Math.random(), 1]),
    gl.STATIC_DRAW);
}
// 定义一个三角形填充到缓冲里
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 100,
      150, 125,
      175, 100]),
    gl.STATIC_DRAW);
}