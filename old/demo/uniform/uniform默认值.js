import initShaders from "./initShaders.js";


// 本Demo演示uniform变量的默认值：
// 默认情况下，uniform变量各个分量的默认值都是0，比如下面的代码，u_offset没有显示赋值，
// 因此u_offset各个分量的值都是0
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    attribute vec3 a_position;
    uniform vec4 u_offset;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 1.0) + u_offset;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();
