import initShaders from "./initShaders.js";


const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return
  }
  console.log('gl...', gl)
  const vertexShaderSource = document.getElementById('vertex-shader-2d').text
  const fragmentShaderSource = document.getElementById('fragment-shader-2d').text

  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource)

  const positionLocation = gl.getAttribLocation(program, 'a_position')

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  const positions = [
    0.5, 0.5,
    0.0, 0.0,
    0.5, 0.0
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program)
  gl.vertexAttrib2f(positionLocation, 0.0, 0.5)

  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  console.log('location...', positionLocation)
  // gl.disableVertexAttribArray(positionLocation)
  gl.drawArrays(gl.POINTS, 0, 1)
}

main();