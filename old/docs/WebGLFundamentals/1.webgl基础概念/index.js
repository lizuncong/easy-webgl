import initShaders from "./initShaders.js";
import { resize } from './utils.js'

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  // 所有着色器都有一个main方法
  void main() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position/ u_resolution;

    // 再把 0 -> 1 转换 0 -> 2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 把0 -> 2转换到-1 -> +1(裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    
  }
`;

let fragmentSource = `
  // 片段着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    // gl_FragColor是一个片段着色器主要设置的变量
    gl_FragColor = u_color;
  }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

console.log("program...", positionAttributeLocation);

var positionBuffer = gl.createBuffer();

// 可以看成ARRAY_BUFFER = positionBuffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


/**************************在此之上的代码是 初始化代码。这些代码在页面加载时只会运行一次***********************************************/
/**************************接下来的代码是渲染代码，而这些代码将在我们每次要渲染或者绘制时执行***********************************************/


resize(gl.canvas)
// 告诉WebGL裁剪空间的 -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 
// y轴的 0 -> gl.canvas.height
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program)
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

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




// var primitiveType = gl.TRIANGLES;
// var offset = 0;
// var count = 6; // 顶点着色器将会运行count次。
// gl.drawArrays(primitiveType, offset, count);

// 绘制50个随机颜色矩形
for (var ii = 0; ii < 50; ++ii) {
  // 创建一个随机矩形
  // 并将写入位置缓冲
  // 因为位置缓冲是我们绑定在
  // `ARRAY_BUFFER`绑定点上的最后一个缓冲
  setRectangle(
    gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

  // 设置一个随机颜色
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

  // 绘制矩形
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// 返回 0 到 range 范围内的随机整数
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// 用参数生成矩形顶点并写进缓冲

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
  // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
  // 目前我们只有一个缓冲，如果我们有多个缓冲
  // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2]), gl.STATIC_DRAW);
}