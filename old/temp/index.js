const canvas = document.getElementById("webgl");

const gl = canvas.getContext("webgl");

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    uniform float u_Width;
    uniform float u_Height;
    void main(){
        gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
    }
`;

const initShaders = (gl, vsource, fsource) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);
  gl.program = program;
};

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);


const initVertexBuffers = (gl) => {
  const vertices = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0
  ])
  

  const n = 3;

  const vertexBuffer = gl.createBuffer();

  const FSIZE = vertices.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
  gl.enableVertexAttribArray(a_Color)

  const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
  gl.uniform1f(u_Width, gl.drawingBufferWidth)

  const u_Height = gl.getUniformLocation(gl.program, 'u_Height')
  gl.uniform1f(u_Height, gl.drawingBufferHeight)
  console.log('gl..', gl.drawingBufferWidth, gl.drawingBufferHeight)
  return n
}



const n = initVertexBuffers(gl)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLES, 0, n)

