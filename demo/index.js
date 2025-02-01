const canvas = document.getElementById('webgl')
// 记得获取的是webgl2上下文
const gl = canvas.getContext('webgl2')

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    gl_PointSize = 10.0;
  }
`
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1,0,0.5,1);
  }
`

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource)
const positionLocation = gl.getAttribLocation(program, 'a_position')

gl.useProgram(program)
gl.vertexAttrib2f(positionLocation, 0.0, 0.5)

// 打开的是defaultVAO中的positionLocation属性，即默认的VAO的属性的状态。
gl.enableVertexAttribArray(positionLocation)

var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.drawArrays(gl.POINTS, 0, 1)