import initShaders from "./initShaders.js";
const { mat4,  } = glMatrix

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec3 a_position;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main(){
      v_uv = a_uv;
      gl_Position = vec4(a_position, 1.0); 
      gl_PointSize = 10.0;
    }
`;

let fragmentSource = `
    precision mediump float;
    varying vec2 v_uv;
    void main(){
        gl_FragColor = vec4(v_uv, 0.0, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

function initVertexBuffers() {

  // 4个点的坐标信息
  const position = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
  ])

  // 4个点的信息，图片的4个顶点
  const uvs = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ])

  const FSIZE = position.BYTES_PER_ELEMENT;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_position);



  const uvsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

  const a_uv = gl.getAttribLocation(program, "a_uv");
  gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 2 * FSIZE, 0);
  gl.enableVertexAttribArray(a_uv);

}

initVertexBuffers()

function draw(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  // gl.drawArrays(gl.POINTS, 0, 4)
}

draw()


