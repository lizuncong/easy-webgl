const canvas = document.getElementById("webgl");

const gl = canvas.getContext("webgl");

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
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
gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0)
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, 1);
