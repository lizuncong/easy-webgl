const canvas = document.getElementById('webgl')
const gl = canvas.getContext('webgl')
const vertexShaderSource = `
    attribute vec2 a_position1;
    void main() {
      gl_Position = vec4(a_position1, 0, 1);
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
const positionLocation1 = gl.getAttribLocation(program, 'a_position1')

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program)
gl.vertexAttrib2f(positionLocation1, 0.5, 0.5)

gl.drawArrays(gl.POINTS, 0, 1)