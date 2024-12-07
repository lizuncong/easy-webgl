import initShaders from "./initShaders.js";

// 如果顶点着色器和片段着色器定义同名的uniform变量，
// 则这个变量会同时作用于两个着色器
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    precision mediump float;
    attribute vec3 a_position;
    uniform vec4 u_offset;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 0.1) + u_offset;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    uniform vec4 u_offset;
    void main(){
        gl_FragColor = vec4(0.1, 0.0, 0.0, 0.1) + u_offset;
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)
  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const offsetLoc = gl.getUniformLocation(program1, 'u_offset')

  console.log('offsetLoc...', offsetLoc)

  let verticesInfo = [
    0.5, 0.0,
    0.0, 0.5,
    -0.5, 0.0
  ]
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



  gl.enableVertexAttribArray(positionLocation1);

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 由于声明u_offset的是vec4，需要4个分量，因此下面的代码调用gl.uniform3f会报错。
  // gl.uniform3f(offsetLoc, 0.3, 0.3, 0.3)
  gl.uniform4f(offsetLoc, 0.4, 0.0, 0.0, 0.9)

  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();
