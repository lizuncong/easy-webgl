import initShaders from "./initShaders.js";


const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  const vertexShaderSource1 = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main(){
        v_color = a_color;
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 1.0);
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    varying vec3 v_color;
    void main(){
        gl_FragColor = vec4(v_color, 1.0);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)

  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const colorPosition = gl.getAttribLocation(program1, 'a_color')

  let positions = [
    // x y  r g b 前面两个代表坐标，后面三个代表颜色rgb的值
    -0.5, 0.0, 1.0, 0.0, 0.0,
    0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.8, 0.0, 0.0, 1.0
  ]
  positions = new Float32Array(positions)



  const FSIZE = positions.BYTES_PER_ELEMENT // 4
  console.log('positions...',FSIZE, positions)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  // 设置属性positionLocation1的一系列状态，告诉它应该怎么从缓冲中读取数据
  // 定义点的信息
  gl.vertexAttribPointer(
    positionLocation1,
    2, // size，attribute变量的长度(vec2)
    gl.FLOAT, // type, buffer的数据类型
    false,
    5 * FSIZE, // 每个点的信息所占的bytes
    0
  );
  gl.vertexAttribPointer(
    colorPosition,
    3, // size，attribute变量的长度(vec3)
    gl.FLOAT,
    false,
    5 * FSIZE,
    2 * FSIZE
  );

  // 告诉webgl，属性positionLocation1应该从缓冲中读取数据，而不是从attributeValues中读取数据
  gl.enableVertexAttribArray(positionLocation1);
  gl.enableVertexAttribArray(colorPosition);

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)
  // gl.drawArrays(gl.TRIANGLES, 0, 3);

}

main();


// 如果每个类型的数据都用一个缓冲存储，stride 和 offset 都是 0 。 
// 对 stride 来说 0 表示 “用符合单位类型和单位个数的大小”。
//  对 offset 来说 0 表示从缓冲起始位置开始读取。 
//  它们使用 0 以外的值时会复杂得多，虽然这样会取得一些性能能上的优势，
//   但是一般情况下并不值得，除非你想充分压榨WebGL的性能
// gl.vertexAttribPointer(
//   normalLoc,  // location
//   3,          // size (components per iteration) 在顶点着色器声明时已经指定了vec4类型，为啥这里还要传？
//   gl.FLOAT,   // type of to get from buffer
//   false,      // normalize
//   0,          // stride (bytes to advance each iteration)
//   0,          // offset (bytes from start of buffer)
// );

// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
// var size = 2;          // 每次迭代运行提取两个单位数据
// var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
// var normalize = false; // 不需要归一化数据
// var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// // 每次迭代运行运动多少内存到下一个数据开始点
// var offset = 0;        // 从缓冲起始位置开始读取

// // 一个隐藏信息是gl.vertexAttribPointer是将属性绑定到当前的ARRAY_BUFFER。 
// // 换句话说就是属性绑定到了positionBuffer上。这也意味着现在利用绑定点随意将 
// // ARRAY_BUFFER绑定到其它数据上后，该属性依然从positionBuffer上读取数据。
// gl.vertexAttribPointer(
//   positionAttributeLocation, size, type, normalize, stride, offset)



// 如果用JavaScript代替GLSL，当它运行的时候，你可以想象它做了类似以下的事情

// var positionBuffer = [
//   0, 0, 0, 0,
//   0, 0.5, 0, 0,
//   0.7, 0, 0, 0,
// ];
// var attributes = {};
// var gl_Position;
 
// drawArrays(..., offset, count) {
//   var stride = 4;
//   var size = 4;
//   for (var i = 0; i < count; ++i) {
//      // 从positionBuffer复制接下来4个值给a_position属性
//      const start = offset + i * stride;
//      attributes.a_position = positionBuffer.slice(start, start + size);
//      runVertexShader();// 运行顶点着色器
//      ...
//      doSomethingWith_gl_Position();
// }




// vertexAttribPointer 中的 normalizeFlag 参数是什么意思？
// 标准化标记（normalizeFlag）适用于所有非浮点型数据。如果传递false就解读原数据类型。 BYTE 类型的范围是从 -128 到 127，UNSIGNED_BYTE 类型的范围是从 0 到 255， SHORT 类型的范围是从 -32768 到 32767，等等...

// 如果标准化标记设为true，BYTE 数据的值(-128 to 127)将会转换到 -1.0 到 +1.0 之间， UNSIGNED_BYTE (0 to 255) 变为 0.0 到 +1.0 之间，SHORT 也是转换到 -1.0 到 +1.0 之间， 但比 BYTE 精确度高。

// 最常用的是标准化颜色数据。大多数情况颜色值范围为 0.0 到 +1.0。 使用4个浮点型数据存储红，绿，蓝和阿尔法通道数据时，每个顶点的颜色将会占用16字节空间， 如果你有复杂的几何体将会占用很多内存。代替的做法是将颜色数据转换为四个 UNSIGNED_BYTE ， 其中 0 表示 0.0，255 表示 1.0。现在每个顶点只需要四个字节存储颜色值，省了 75% 空间。

// 我们来修改之前代码实现。当我们告诉WebGL如何获取颜色数据时将这样

// 归一化详见：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-how-it-works.html