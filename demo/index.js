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
  // const x = 0.25, y = 0.25, textWidth = 0.5, textHeight = 0.5;
  const x = 0, y = 0, textWidth = 1.0, textHeight = 1.0;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x, y + textHeight,
    x + textWidth, y + textHeight,
    x, y,
    x, y,
    x + textWidth, y + textHeight,
    x + textWidth, y
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  const rectX = -1.0, rectY = 1.0, rectWidth = 2.0, rectHeight = 2.0
  let verticesInfo = [
    rectX, rectY,
    rectX + rectWidth, rectY,
    rectX, rectY - rectHeight,
    rectX, rectY - rectHeight,
    rectX + rectWidth, rectY,
    rectX + rectWidth, rectY - rectHeight,
  ]
 
  verticesInfo = new Float32Array(verticesInfo);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesInfo, gl.STATIC_DRAW);

  gl.vertexAttribPointer(positionLocation1, 2, gl.FLOAT, false, 8, 0);

  gl.enableVertexAttribArray(positionLocation1);

  // 创建纹理
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 用 4x4 的像素填充纹理
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 3;
  const height = 2;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  const data = new Uint8Array([
    255, 0, 0, 255, // 红
    0, 255, 0, 255, // 绿
    0, 0, 255, 255, // 蓝
    // 255, 255, 0, 255, // 黄

    255, 0, 255, 255, // 品红色
    0, 255, 255, 255, // 青色
    105, 255, 105, 255,   // 青柠绿
    // 0, 0, 0, 255, // 黑色


    // 255, 165, 0, 255,    // 橙色
    // 75, 32, 132, 255,    // 深紫色
    // 255, 218, 0, 255,    // 金色
    // 124, 252, 0,  255,   // 荧光绿

    // 255, 20, 133, 255,      // 珊瑚色
    // 255, 182, 193, 255,   // 淡粉红
    // 138, 43, 238, 255,    // 魔法蓝
    // 255, 255, 255, 255,     // 白色
  ]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


  gl.clearColor(0, 0, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)


  gl.drawArrays(gl.TRIANGLES, 0, 6)

}

main()




