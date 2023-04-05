const canvas = document.getElementById("webgl");

const gl = canvas.getContext("webgl");

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_Size;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
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
const a_Position = gl.getAttribLocation(gl.program, "a_Position");
const a_Size = gl.getAttribLocation(gl.program, "a_Size");
const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

console.log("u_FragColor===", u_FragColor);

const g_points = [];
const g_colors = [];
canvas.onclick = (ev) => {
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.height / 2) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  g_points.push([x, y]);

  if(x >= 0.0 && y >= 0.0){
    g_colors.push([1.0, 0.0, 0.0, 1.0])
  } else if(x < 0.0 && y < 0.0){
    g_colors.push([0.0, 1.0, 0.0, 1.0])
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0])
  }


  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_points.length; i ++) {
    const xy = g_points[i]
    const rgba = g_colors[i]
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
};

gl.vertexAttrib1f(a_Size, 10.0);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
