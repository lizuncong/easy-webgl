const canvas = document.getElementById("webgl");

const gl = canvas.getContext("webgl");

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_Size;
    attribute float a_Size1;
    attribute float a_Size2;
    attribute float a_Size3;
    attribute float a_Size4;
    attribute float a_Size5;
    attribute float a_Size6;
    attribute float a_Size7;
    attribute float a_Size8;
    attribute float a_Size9;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_Size + a_Size1 + a_Size2 + a_Size3 + a_Size4 + a_Size5 + a_Size6 + a_Size7 + a_Size8 + a_Size9;
    }
`;

const FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const initShaders = (gl, vsource, fsource) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fsource)
  gl.compileShader(fragmentShader)

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader)
  gl.attachShader(program,fragmentShader)

  gl.linkProgram(program)
  gl.useProgram(program)
  gl.program = program
};

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
const a_Size = gl.getAttribLocation(gl.program, 'a_Size')
const a_Size1 = gl.getAttribLocation(gl.program, 'a_Size1')
const a_Size2 = gl.getAttribLocation(gl.program, 'a_Size2')
const a_Size3 = gl.getAttribLocation(gl.program, 'a_Size3')
const a_Size4 = gl.getAttribLocation(gl.program, 'a_Size4')
const a_Size5 = gl.getAttribLocation(gl.program, 'a_Size5')
const a_Size6 = gl.getAttribLocation(gl.program, 'a_Size6')
const a_Size7 = gl.getAttribLocation(gl.program, 'a_Size7')
const a_Size8 = gl.getAttribLocation(gl.program, 'a_Size8')
const a_Size9 = gl.getAttribLocation(gl.program, 'a_Size9')

console.log('a_Position....', a_Position, a_Size9)
gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0)
gl.vertexAttrib1f(a_Size, 10.0)
gl.vertexAttrib1f(a_Size1, 1.0)
gl.vertexAttrib1f(a_Size2, 1.0)
gl.vertexAttrib1f(a_Size3, 1.0)
gl.vertexAttrib1f(a_Size4, 1.0)
gl.vertexAttrib1f(a_Size5, 1.0)
gl.vertexAttrib1f(a_Size6, 1.0)
gl.vertexAttrib1f(a_Size7, 1.0)
gl.vertexAttrib1f(a_Size8, 1.0)
gl.vertexAttrib1f(a_Size9, 1.0)

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, 1);
