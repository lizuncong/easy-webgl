import initShaders from "./initShaders.js";
import { resize } from './utils.js'

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
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
    

    // 将纹理坐标传给片段着色器，GPU会在点之间进行插值
    v_texCoord = a_texCoord;

  }
`;

let fragmentSource = `
  // 片段着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
  // 纹理
  uniform sampler2D u_image;
  // 从顶点着色器传入的纹理坐标
  varying vec2 v_texCoord;
  void main() {
    // 在纹理上寻找对应颜色值
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

const drawScene = (image) => {

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  console.log("program...", gl.getParameter(gl.MAX_VERTEX_ATTRIBS), positionAttributeLocation, resolutionUniformLocation);

  var positionBuffer = gl.createBuffer();
  // 可以看成ARRAY_BUFFER = positionBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);


  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

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
  gl.enableVertexAttribArray(texcoordLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);


  // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    texcoordLocation, size, type, normalize, stride, offset);


  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}



function main() {
  var image = new Image();
  image.src = "./leaves.jpg";
  image.onload = function () {
    drawScene(image);
  };
}
main();
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
}