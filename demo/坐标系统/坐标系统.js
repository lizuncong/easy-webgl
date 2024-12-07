import initShaders from "./initShaders.js";


const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    attribute vec2 a_position;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 0.0, 1.0);
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


  let verticesInfo = [
    1.0, 0.0,
    -1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0,
    0.0, -1.0,
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




  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)

  gl.enableVertexAttribArray(positionLocation1);

  gl.drawArrays(gl.POINTS, 0, 5)

}

main();
