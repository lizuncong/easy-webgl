const main = (image) => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
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
    x, y,
    x + textWidth, y,
    x, y + textHeight,
    x, y + textHeight,
    x + textWidth, y,
    x + textWidth, y + textHeight,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  const rectX = 0.0, rectY = 0.5, rectWidth = 0.5, rectHeight = 0.5
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
   // 将图像上传到纹理
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


  gl.clearColor(0, 0, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)


  gl.drawArrays(gl.TRIANGLES, 0, 6)

}

// // 图片URL
const imageUrl = "./color.png"

const image = new Image();
image.src = imageUrl  
image.onload = function () {
  main(image);
}

const img = new Image();
img.src = imageUrl;

img.onload = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  console.log('rgba：', data)

};
