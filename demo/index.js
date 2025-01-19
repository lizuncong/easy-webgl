const canvas = document.getElementById('webgl')
const gl = canvas.getContext('webgl')
const vertexShaderSource1 = `
  attribute vec2 a_position1;
  void main() {
    gl_Position = vec4(a_position1, 0, 1);
    gl_PointSize = 10.0;
  }
`
const fragmentShaderSource1 = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1,0,0.5,1);
  }
`
const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)

const positionLocation1 = gl.getAttribLocation(program1, 'a_position1')

const positions = [
  0.0, 0.0,
]
const positionBuffer = gl.createBuffer();
console.log('position...',positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// 设置属性positionLocation1的一系列状态，告诉它应该怎么从缓冲中读取数据
gl.vertexAttribPointer(
  positionLocation1, 2, gl.FLOAT, false, 0, 0)

// 告诉webgl，属性positionLocation1应该从缓冲中读取数据，而不是从attributeValues中读取数据
gl.enableVertexAttribArray(positionLocation1);
// 当调用enableVertexAttribArray告诉属性从缓冲读取数据，即使再调用vertexAttrib2f设置属性的值，也没用
// 属性依旧会从缓冲中读取数据
gl.vertexAttrib2f(positionLocation1, 0.5, 0.5)
gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program1)
// 告诉webgl绘制1个点
gl.drawArrays(gl.POINTS, 0, 1)

// 告诉属性不要再从缓冲中读取数据
gl.disableVertexAttribArray(positionLocation1);
gl.drawArrays(gl.POINTS, 0, 1)