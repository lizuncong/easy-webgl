import initShaders from "./initShaders.js";
import { positions, colors } from "./cube_data.js";
const { mat4 } = glMatrix;

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
attribute vec3 a_position;
uniform mat4 u_rotateMatrix;
uniform mat4 u_translateMatrix;
uniform mat4 u_scaleMatrix;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  mat4 modelMatrix = u_rotateMatrix * u_translateMatrix * u_scaleMatrix;
  v_color = a_color;
  gl_Position = modelMatrix * vec4(a_position, 1.0);
}
`;

let fragmentSource = `
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`;

const program = initShaders(gl, vertexSource, fragmentSource);
initVertexBuffers();

let deg = 45;
const rotateMatrix = mat4.create();
mat4.fromRotation(rotateMatrix, (deg / 180) * Math.PI, [1, 0.5, 0]);

const translateMatrix = mat4.create();
mat4.fromTranslation(translateMatrix, [0.5, 0.0, 0.0]);

const scaleMatrix = mat4.create();
mat4.fromScaling(scaleMatrix, [0.5, 0.5, 0.5]);


const u_rotateMatrix = gl.getUniformLocation(program, "u_rotateMatrix");
const u_translateMatrix = gl.getUniformLocation(program, 'u_translateMatrix');
const u_scaleMatrix = gl.getUniformLocation(program, 'u_scaleMatrix')

gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);
gl.uniformMatrix4fv(u_translateMatrix, false, translateMatrix);
gl.uniformMatrix4fv(u_scaleMatrix, false, scaleMatrix);


function initVertexBuffers() {
  const FSIZE = positions.BYTES_PER_ELEMENT;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_position);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const a_color = gl.getAttribLocation(program, "a_color");
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_color);
}

draw();

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 24);
  // gl.drawArrays(gl.POINTS, 0, 24);
  for (let i = 0; i < 24; i += 4) {
    gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
  }
}
