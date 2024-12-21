const main = (image) => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  const vertexShaderSource1 = `
    attribute vec2 a_texCoord;
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 0.0, 1.0);
        // 将纹理坐标传给片段着色器
        // GPU会在点之间进行插值
        v_texCoord = a_texCoord;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    uniform sampler2D u_image;
    // 从顶点着色器传入的纹理坐标
    varying vec2 v_texCoord;
    void main(){
      // 在纹理上寻找对应颜色值
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)
  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const texCoordLocation = gl.getAttribLocation(program1, "a_texCoord");

  // 给矩形提供纹理坐标
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  const x = 1.0, y = 1.0;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    x, 0.0,
    0.0, y,
    0.0, y,
    x, 0.0,
    x, y
  ]), gl.STATIC_DRAW);

  const rectX = -0.5, rectY = 0.5, rectWidth = 0.8, rectHeight = 0.8 //rectWidth * (image.height / image.width)
  let verticesInfo = [
    rectX, rectY,
    rectX + rectWidth, rectY,
    rectX, rectY - rectHeight,
    rectX, rectY - rectHeight,
    rectX + rectWidth, rectY,
    rectX + rectWidth, rectY - rectHeight,
  ]
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // 创建纹理
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 用 3x2 的像素填充纹理
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 64;
  const height = 85.3;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  const data = new Uint8Array([
    255, 0, 0, 255,
    0, 255, 0, 255,
    0, 0, 255, 255,
    255, 255, 0, 255,

    255, 0, 255, 255,
    0, 255, 255, 255,
    255, 255, 255, 255,
    0, 0, 0, 255,
  ]);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // console.log('image...', image)
  // // 将图像上传到纹理
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
    format, type, image);
  verticesInfo = new Float32Array(verticesInfo)

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesInfo, gl.STATIC_DRAW)


  gl.vertexAttribPointer(
    positionLocation1,
    2,
    gl.FLOAT,
    false,
    8,
    0
  );



  gl.clearColor(0, 0, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)

  gl.enableVertexAttribArray(positionLocation1);

  gl.drawArrays(gl.TRIANGLES, 0, 6)

}


// const image = new Image();
// image.src = "./1.jpeg";  // 必须在同一域名下
// image.onload = function () {
//   main(image);
// }

// 图片URL
const imageUrl = './1.jpeg';

// 使用fetch获取图片的ArrayBuffer
fetch(imageUrl)
  .then(response => response.arrayBuffer())
  .then(buffer => {
    // buffer 包含了图片的二进制数据
    console.log(new Uint8Array(buffer));
    main(new Uint8Array(buffer))
  })
  .catch(error => {
    console.error('Error fetching image:', error);
  });